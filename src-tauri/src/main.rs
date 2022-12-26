#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    ffi::OsStr,
    fs::{create_dir_all, File, OpenOptions},
    io::Write,
    path::Path,
    str::from_utf8,
};

use reqwest::Client;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn download(src: &str, base: &str, origin: &str) -> Result<(), ()> {
    match reqwest::get(base).await.unwrap().text().await {
        Err(error) => {
            let dir: &str = &format!("{}/error.txt", origin).to_owned()[..];
            let path: &Path = Path::new(OsStr::new(from_utf8(dir.as_bytes()).unwrap()));
            let text = &format!("Error: {}", base);
            if path.exists() {
                let mut file: File = OpenOptions::new().append(true).open(path).unwrap();
                writeln!(file, "{}", text).expect("Fail to write file");
            } else {
                create_dir_all(path.parent().unwrap()).unwrap();
                let mut file: File = OpenOptions::new()
                    .create_new(true)
                    .write(true)
                    .open(dir)
                    .unwrap();
                writeln!(file, "{}", text).expect("Fail to write file");
            }
            panic!("Error: {:?}", error);
        }
        Ok(texts) => {
            let split: Vec<&str> = texts.split("\n").collect();
            let mut index = split.iter().position(|r| r.contains("/title>")).unwrap();

            let label = &split[index][7..(split[index].len() - 8)];

            index = split
                .iter()
                .position(|r| r.contains("id=\"image\""))
                .unwrap();
            index += 1;

            let mut images: Vec<&str> = Vec::new();
            loop {
                let item: &str = split[index];
                if item.contains("/div>") {
                    break;
                }

                index += 1;
                let slice: Vec<&str> = split[index].split("\"").collect();
                if slice.len() != 1 {
                    images.push(slice[1]);
                }
            }

            for (num, image) in images.iter().enumerate() {
                let key = num + 1;
                let url: &str = &image;
                let client: Client = Client::new();

                match client
                    .get(url)
                    .header("Referer", src)
                    .send()
                    .await
                    .unwrap()
                    .bytes()
                    .await
                {
                    Err(error) => {
                        let dir: &str = &format!("{}/{}/error.txt", origin, label).to_owned()[..];
                        let path: &Path = Path::new(dir);
                        let text = &format!("Error: {}.jpg\n{}", key, image);
                        if path.exists() {
                            let mut file: File =
                                OpenOptions::new().append(true).open(path).unwrap();
                            writeln!(file, "{}", text).expect("Fail to write file");
                        } else {
                            create_dir_all(path.parent().unwrap()).unwrap();
                            let mut file: File = OpenOptions::new()
                                .create_new(true)
                                .write(true)
                                .open(dir)
                                .unwrap();
                            writeln!(file, "{}", text).expect("Fail to write file");
                        }
                        panic!("Error: {:?}", error);
                    }
                    Ok(bytes) => {
                        let dir: &str = &format!("{}/{}/{}.jpg", origin, label, key).to_owned()[..];
                        let path: &Path = Path::new(OsStr::new(from_utf8(dir.as_bytes()).unwrap()));
                        if !path.exists() {
                            create_dir_all(path.parent().unwrap()).unwrap();
                        }

                        let mut file: File = File::create(path).unwrap();
                        file.write_all(&bytes).unwrap();
                    }
                }
            }

            let dir: &str = &format!("{}/done.txt", origin).to_owned()[..];
            let path: &Path = Path::new(OsStr::new(from_utf8(dir.as_bytes()).unwrap()));
            let text = &format!("Done: {}", base);
            if path.exists() {
                let mut file: File = OpenOptions::new().append(true).open(path).unwrap();
                writeln!(file, "{}", text).expect("Fail to write file");
            } else {
                create_dir_all(path.parent().unwrap()).unwrap();
                let mut file: File = OpenOptions::new()
                    .create_new(true)
                    .write(true)
                    .open(dir)
                    .unwrap();
                writeln!(file, "{}", text).expect("Fail to write file");
            }
        }
    };
    return Ok(());
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

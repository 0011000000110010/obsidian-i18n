import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

// 从 manifest.json 中读取 minAppVersion，并将版本提升至目标版本
let manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

// 使用 manifest.json 中的目标版本和 minAppVersion 更新 versions.json
let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));

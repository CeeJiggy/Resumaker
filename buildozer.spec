[app]
title = Resumaker
package.name = resumaker
package.domain = org.resumaker
source.dir = .
source.include_exts = py,png,jpg,kv,atlas,ttf,json
version = 0.1
requirements = python3,kivy,reportlab==4.0.8,python-dotenv==1.0.0,SQLAlchemy==2.0.25
orientation = portrait
osx.python_version = 3
osx.kivy_version = 2.2.1
fullscreen = 0
android.permissions = INTERNET,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE
android.arch = arm64-v8a
android.api = 31
android.minapi = 21
android.ndk = 25b
android.sdk = 33
android.gradle_dependencies = org.xerial:sqlite-jdbc:3.36.0
android.allow_backup = True

[buildozer]
log_level = 2
warn_on_root = 1 
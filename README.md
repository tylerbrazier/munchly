Eat Fargo
=========
Mobile web app for restaurant menus.

Features
--------
- pictures for every single menu item
- allow customer feedback and ratings per item
- easy to update the menu at `/admin` - no more reprinting menus
- theme is customizable by uploading a `local.css` file at `/admin/upload`

Install
-------

    # as root
    pacman -S mongodb nodejs npm
    systemctl start mongodb
    systemctl enable mongodb

    # in project directory
    npm install
    npm run gulp
    test/insert-test-data.js
    cp .default.conf.js conf.js
    vi conf.js  # edit

Run
---
For development:

    npm install -g nodemon
    nodemon server.js

For production, use a service:

    # make edits if needed
    vi eatfargo.system

    # as root
    cp eatfargo.system /etc/systemd/system/
    systemctl start eatfargo.system
    systemctl enable eatfargo.system

    # make sure it's working
    systemctl status eatfargo.system

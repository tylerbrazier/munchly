Munchly
=========
Mobile web app for restaurant menus.

Features
--------
- Pictures for every single menu item
- Allow customer feedback and ratings per item
- Easy to update the menu at `/admin` - no more reprinting menus
- Theme is customizable by uploading a `local.css` file at `/admin/upload`

Motivation
----------
- Menus should be pictures, not words
- Menus should be accessible
- Better interaction between restaurant owners and customers: deals could be
  offered in exchange for feedback
- Restaurants can get *private* feedback (unlike Yelp)
- Feedback is on individual menu items
- Advertising route via social media sharing
- Advertising for other local businesses - "Do you have plans after your meal?
  Here's whats playing at some local cinemas..."

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
    vi munchly.system

    # as root
    cp munchly.system /etc/systemd/system/
    systemctl start munchly.system
    systemctl enable munchly.system

    # make sure it's working
    systemctl status munchly.system

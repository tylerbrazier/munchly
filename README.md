Eat Fargo
=========

Install
-------

    npm install
    sudo npm install -g gulp
    gulp

Run
---
For development:

    node index.js

For production, use a service:

    # make edits if needed
    vi eatfargo.system

    # as root
    cp eatfargo.system /etc/systemd/system/
    systemctl start eatfargo.system
    systemctl enable eatfargo.system

    # make sure it's working
    systemctl status eatfargo.system

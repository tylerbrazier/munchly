Eat Fargo
=========

Install
-------

    # as root
    pacman -S mongodb nodejs npm
    systemctl start mongodb
    systemctl enable mongodb
    npm install -g gulp nodemon

    # in project directory
    ./init.sh
    test/insert-test-data.js

The `local` directory is gitignored and holds things local to a particular
restaurant including `conf.js[on]`, the server log, and static web content in
the `local/web` directory such as images and custom css.

Run
---
For development:

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

# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/trusty64"
    config.vm.network "private_network", ip: "10.0.0.200"
    config.vm.synced_folder ".", "/vagrant", disabled: true
    config.vm.synced_folder ".", "/home/app", type: "nfs"

    config.vm.provider "virtualbox" do |vb|
        vb.memory = 1536
        vb.cpus = 2
    end

    config.vm.provision "shell", path: "provision.sh"
end

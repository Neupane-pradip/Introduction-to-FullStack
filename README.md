# Introduction to Full Stack Development

My Tampere University web development coursework, progressing from HTML and browser JavaScript to HTTP servers, authentication, persistence, and application architecture.

The repository combines supplied course material, tests, and exercise work. It is a historical coursework snapshot with partial exercises rather than one finished application.

## Learning path

| Folder under `exercises/` | Focus |
|---|---|
| `01_html/`, `02_css/` | Markup and styling |
| `03_javascript/` | DOM manipulation and events |
| `04_http/` | Node.js HTTP servers and responses |
| `05_cookie/` | Cookies and sessions |
| `06_async/` | Callbacks, promises, and async functions |
| `07_security/` | Web security demonstrations |
| `08_authentication/` | Authentication and event-app exercises |
| `09_data_persistence/` | MongoDB and Mongoose |
| `10_architecture/` | Controllers, routes, middleware, and models |

## Requirements

- A web browser for the HTML/CSS exercises.
- Node.js and npm for server-side exercises.
- MongoDB for exercises that connect to a database.

Dependencies and commands belong to individual exercise directories. The root `npm test` script is a placeholder and is not a course-wide test runner.

## View a static exercise

Open an exercise's `index.html` in a browser, or serve the repository locally with Python 3:

```sh
python -m http.server 8000
```

Browse to `http://localhost:8000/exercises/01_html/ex3/`.

## Run a small HTTP exercise

The header-response example uses Node's built-in HTTP module:

```sh
node exercises/04_http/ex3/index.js
```

Visit `http://localhost:3000`. Stop the process with Ctrl+C before starting another server on the same port.

For exercises with a `package.json`, change into that folder, run `npm install`, and inspect its scripts before using `npm start` or `npm test`.

## Current limitations

- Some files retain placeholders or incomplete solutions.
- `exercises/04_http/ex2/index.js` contains unresolved merge-conflict markers and needs repair before it can run.
- Later database exercises require local configuration; inspect their environment-variable usage instead of assuming one configuration fits every round.
- Security exercises are demonstrations for local study.
- Supplied tests and starter code remain attributable to the course authors.

<details>
<summary>Original course environment and submission instructions</summary>

# Welcome to Introduction to Full Stack Development course!

First read this README and please read it completely :-)

## Your repository and the exercises
This is your personal TUNI GitLab repository for the course's exercises. The exercises for the first exercise round are already in this repository. They are copied to your local working directory when you clone the repo. Exercises for the other upcoming exercise rounds must be pulled from the course upstream, see Plussa exercise "Setting upstream".

The general procedure for getting and doing the exercises
- pull the instructions from the course upstream (not necessary in the first exercise round). Directories holding the exercises are of the format `exercises/XX_desc` where XX is the exercise round number
- do the exercises
- save the required files to your repository: `git add FILE; git commit -m "message" FILE; git push`
- submit your GitLab repository SSH URL to Plussa
- Plussa automatically grades your submission and gives you feedback

## Required tools: Git, Node.js and MongoDB
For doing the exercises you need to have Git, Node.js and MongoDB installed on your development system. For installing the tools there are a few options:
- Vagrant virtual environment: use the Vagrant environment with the Vagrant files provided in this repository. Vagrant can use them to create and run a development environment with appropriate tools on your machine, including both Node.js and MongoDB. MongoDB will be used in the later exercises. Read more under the heading "Using Vagrant to create and run a development environment on your machine"
    - Note: Vargrant is for x86 machines only. If you are rocking a non-x86 chip (I'm looking at you, Apple silicon), then Vagrant is not for you. Normally, we would recommend you to choose Docker, but since that is the topic of a different course, we can't officially recommend (or rather, support) that.
- Local installs: you can install Node.js to your machine using the packages from Node.js pages. Read more under the heading "Direct install of Node to your own machine"

## Using Vagrant to create and run a development environment on your machine
From [Vagrants Introduction](https://www.vagrantup.com/intro):
>Vagrant is a tool for building and managing virtual machine environments in a single workflow. With an easy-to-use workflow and focus on automation, Vagrant lowers development environment setup time, increases production parity, and makes the "works on my machine" excuse a relic of the past.

To start using Vagrant on your machine, first install the needed software

- install VirtualBox, which is used by Vagrant. [Virtualbox downloads](https://www.virtualbox.org/wiki/Downloads)
- install Vagrant. [Vagrant downloads](https://www.vagrantup.com/downloads)

After you have successfully installed both VirtualBox and Vagrant, you get to set up and access the virtual environment by using files in this repository. This repository has a _Vagrantfile_ file in its root folder, and _/vagrant_ folder, which holds _provision.sh_ file which is called from the _Vagrantfile_. You should read through these files, but you don't (and shouldn't) edit them.

In the root directory of this repository where the _Vagrantfile_ is, first run this command in your console:

`vagrant help`

This will list the available Vagrant commands. We will only be using a few of them in the following steps and in this course.

Next, start the configuration and setting up of the virtual environment with this command

`vagrant up`

This will take a looong time to complete, as it fetches an image of Ubuntu for the virtual machine, and runs all the installation steps defined in _provision.sh_.

After the vagrant up command has completed, you can connect to the running virtual environment with this command:

`vagrant ssh`

Now you should be in your virtual environment. All the files in the repository are linked in the directory _/webdev1_ of your virtual environment. You can access this folder with the command 
    _cd /webdev1_

Ports 3000 for Node and 27017 for MongoDB are open from the virtual environment to the same port numbers of the host system (your computer's operating system). So, if you run a Node server in your virtual environment on port 3000, you can access it from the host system with your browser using the address _localhost:3000_.

Use command `vagrant halt` to shut down the machine (when not logged in with ssh)

Use command `vagrant destroy` to delete the whole virtual machine   

If you get an error: symlink error, error -71, etc. with when running Vagrant on Windows machines, use the parameter --no-bin-links.
Check https://github.com/npm/npm/issues/7308 and http://perrymitchell.net/article/npm-symlinks-through-vagrant-windows/

If you are running Vagrant on either Linux, macOS or Solaris, and you get an error:

    The IP address configured for the host-only network is not within the
    allowed ranges. Please update the address used to be within the allowed
    ranges and run the command again.
        Address: 192.168.33.10
        Ranges: 192.168.56.0/21
    Valid ranges can be modified in the /etc/vbox/networks.conf file. For
    more information including valid format see: 
    https://www.virtualbox.org/manual/ch06. html#network_hostonly

The error can be solved by creating the `/etc/vbox/networks.conf` file and adding these lines to it:

    * 10.0.0.0/8 192.168.0.0/16
    * 2001::/64


## Direct install of Node to your own developent machine
Direct installation of Node.js is instructed in the Handson video which is available in Plussa first lecture week course materials. Shortly summarized:

In *Linux* you can install Node with the following commands in your console:

`node -v`

`curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh -o install_nvm.sh`

`bash install_nvm.sh`

`source ~/.profile`

`nvm install 14.9.0`

`nvm use 14.9.0`

`node -v`

In *Windows*, you can follow [Microsoft's own instructions for Node installation](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows).


## Support for exercises and other course work
Support from peers and course personnel is available in the course's Teams team, which has separate channels for each exercise round.
</details>

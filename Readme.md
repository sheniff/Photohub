Project PhotoHub
================
Go out, hang out, take photos!
PhotoHub makes the rest.

Using Git for this project
--------------------------
This is what you have to do to take part in this project!

Create a GitHub free account

Make a fork of this project into your own account. It's as simple as press "Fork" button at the top right of the page. From this moment on, you will have a copy of this project in your account (it will be <your username>/photohub instead of sheniff/photohub).

Now you can go to your pc and, wherever you want to download the project, type:
```
git clone git@github.com:<yourname>/photohub.git
```
You will find that URL at the top of the page in your project copy.

Add main photohub repo as remote repo (for updating your code with the latest):
```
git remote add sheniff git@github.com:sheniff/photohub.git
```
If you access the project folder and type:
```
git branch
```
A list of the available branches for the project, being "master" the main branch.

Creating a new branch to work
-----------------------------
Every time you want to create new content for the project, you have to create a new branch by writing:
```
git checkout -b <name for the branch>
```
NEVER MAKE CHANGES OVER THE MASTER BRANCH

At the moment you run the command above, a new branch will be created from the main project and you will be ready to work on it. It's usual to create new branches for:
  * Bug fixing: You can have a branch for that, so that "work-in-progress" changes don't have to be committed only because a bug-fix is required.
  * New features: You can create a new branch to add a new feature to the project. This way, you can check it out as much as you need before merging it to the whole project. E.g: git checkout -b rating_system
  * Etc...

Whenever you want to check if there were changes over the main branch "master" (i.e: other branches that have been merged with the main project already) just type:
```
git pull origin master
```

To upload your branch to your account at GitHub, type:
```
git push origin <name of the branch>
```

From this moment, you can use the usual commands to work with git
```
git status --> To check out the changes you made
git add . -A --> To add all changes to be commited
git commit -m "<comment>" --> To locally commit the changes
```

Merging branches in the main project
------------------------------------
Once a new branch is ready to be merged with the main project, go to the branch page in your GitHub account and press the button "Pull Request" to ask for a request with the main project. Once it's reviewed, it will be able to be merged with the main branch and it will be available for everybody since then.

Pre-Set up
----------
You will have to install some necessary programs before you can set up the project.
Those are:
  * MongoDB (No-SQL database system we are using)
  * NodeJS
  * NPM (Node Package Manager, to easily manage every nodejs module we will use)

If you are using a debian-based linux distribution, you can install them just by typing

```
apt-get install nodejs npm mongodb
```

You will probably need to launch the MongoDB daemon by running the next command.

```
sudo service mongodb start
```

Don't worry, it will keep running next time you restart your PC.


Setting things up
-----------------
Once you have installed those tools, you are almost ready to go! The only thing you have to do now is running the following command:

```
npm install
```

Which will install every package necessary for the project to work.

Finally, run
```
node app
```

to run the server in port 3000 by default.

Using MongoDB console for testing
---------------------------------
If you want to take a look to your Mongo DataBase to check if something is working properly, just type in a terminal:
```
mongo
```

And once there, you can check out your databases using
```
show dbs
```
and change to another by using
```
use <db name>
```

There are a lot of things you can do with MongoDB, but I'm not wasting my time on explaining them here :)

Resources
---------
[Free Git & GitHub course](http://try.github.com/)
[Paid NodeJS course](http://www.codeschool.com/courses/real-time-web-with-nodejs). There must be a lot of free courses out there!
[How to organize NodeJS app](http://madhums.tumblr.com/post/27521420404/breaking-down-app-js-file-nodejs-express-mongoose). I used this post to structure the application and learn how to mix some amazing node modules
[Useful slides about how to write RESTful services using NodeJS](https://speakerdeck.com/u/jakobmattsson/p/writing-restful-web-services-using-nodejs)
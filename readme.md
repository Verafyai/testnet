# Verafy Testnet Demo

* Initial commit is for demo purposes only, more work needed!
* Intended for brainstorming, ideas and visual look at one possible block explorer-type UI.
* Then we can collaboratively change and improve on it.


The demo was produced as a followup to Rex St. John's request for:

1. The testnet is 40-50 containerized agents running fake / pseudo Verafy validators

2. These are 1 page of code max with a single OpenAPI call (no multi AI at first)

3. These receive a broadcast every X intervals with a query

4. Each of them has a prompt “answer this question and randomly vote yes or no”

5. The “leader” rotates like it is in Solana. Each Validator gets a leader slot. Once a leader votes, it submits the result of the summation to IQ

6. The goal of the leader is to ask the network for consensus then submit the result, then pass leadership to the next validator

### Viewing Demo

Initial commit is up here, though we should link this repo so the view is updated:

https://v0-vt-estnet.vercel.app/

It should work locally.

```
# initial one-time install for node_modules

npm install

npm run dev

```
Defaults to local 3000 or increments if you have something running on it.

http://localhost:3000/

### Branching/Updates

* Make a branch for any modifications you make.
* I created a general "dev" branch.
* if making modifications, make a branch off main with your name like csjcode/add-validator-page and commit that branch with your work when done.  (yourname/feature-description)

Then

Example of checkout and branching

```
git checkout main  # Switch to the main branch
git pull origin main  # Ensure it's up to date
git checkout -b yourname/feature-description  # Create a new branch

```

After making your modifications, stage and commit them

```
git add .  # Stage all changes
git commit -m "Added validator page functionality"
```

Push your branch to the remote repository:

```
git push origin yourname/feature-description
```

Go to GitHub/GitLab and create a Pull Request from yourname/feature-description → dev or main (depending on what we agree for workflow).

* We can discuss the best workflow for our git branching, but this is one way, merge into dev branch which we can then review, and then merge into main.

* Before merging, make sure your branch is up to date with the latest changes from main or dev (whichever is the merging target). This avoids conflicts later.
* Manually resolve conflicts

Example merge after approval to dev or main main:

```
git checkout dev  # Switch to dev
git pull origin dev  # Get the latest changes
git merge yourname/feature-description  # Merge your branch into dev
```

Or if merging into main

```
git checkout main  # Switch to main
git pull origin main  # Get the latest changes
git merge yourname/feature-description  # Merge your branch
```


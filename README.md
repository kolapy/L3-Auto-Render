# L3-Auto-Render
Automated lower third rendering for bulk lists of names and titles.   

This script is very simple and usliizes Nexrender for rendering After Effects files.

## Install instructions
To install this script download the install.sh shell script for the releases section.   Run it with the following command

```
./install.sh 
```

## Usage
TO use this script you will need provide it with an After Effects file containing the lower third you wish to automate.
A CSV file containg names and titles.
A JSON file defining the settings for our After Effects render.  See the Nexrender documentation for more info on this.

Once you have the assets all prepared you can use Node to run the script.

```
node render.js
```

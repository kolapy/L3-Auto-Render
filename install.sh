#!/bin/bash

#Install HomeBrew and Node
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo "Installed HomeBrew"

brew install node
echo "Installed Node"

# Function to find the Node.js installation path
find_node_path() {
  local node_path
  # Check if Node.js is installed using `which` command
  if command -v node >/dev/null 2>&1; then
    node_path=$(dirname "$(command -v node)")
  else
    # Check common installation paths for Node.js
    local common_paths=(
      "/usr/local/bin"
      "/usr/bin"
      "/usr/local/opt/node/bin"
    )
    for path in "${common_paths[@]}"; do
      if [[ -x "$path/node" ]]; then
        node_path="$path"
        break
      fi
    done
  fi
  echo "$node_path"
}

# Create a directory in the user's home directory
directory_name="my_folder"
mkdir -p "$HOME/$directory_name"
echo "Created directory: $HOME/$directory_name"

# Download and extract the GitHub repository archive into the created folder
github_repo="https://github.com/kolapy/L3-Auto-Render/archive/refs/heads/main.tar.gz"
curl -sL "$github_repo" | tar xz --strip-components=1 -C "$HOME/$directory_name"
echo "Downloaded and extracted GitHub repository into: $HOME/$directory_name"

# Find the Node.js installation path
node_path=$(find_node_path)
if [[ -z "$node_path" ]]; then
  echo "Node.js not found. Please make sure Node.js is installed."
  exit 1
fi
echo "Node.js found at: $node_path"

# Change directory to the downloaded repository folder
cd "$HOME/$directory_name" || exit

# Install additional libraries using npm locally
echo "Installing additional libraries..."
PATH="$node_path:$PATH" npm install csv-parse --no-save
PATH="$node_path:$PATH" npm install @nexrender/core --no-save

# Print installed versions
echo "Node.js version: $(PATH="$node_path:$PATH" node -v)"
echo "csv-parse version: $(PATH="$node_path:$PATH" npx -p csv-parse -c 'csv-parse --version')"
echo "@nexrender/core version: $(PATH="$node_path:$PATH" npx -p @nexrender/core -c 'nexrender --version')"

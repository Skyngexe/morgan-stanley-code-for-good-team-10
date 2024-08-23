# morgan-stanley-code-for-good-team-10

## Setup Instructions

### 1. Navigate to backend folder

In VSCode, open a new terminal. Then, run the following command to navigate to the backend folder:

```cd backend```

### 2. Create a Virtual Environment

To avoid including the `venv` folder in the repository, each team member should create their own virtual environment. Run the following command to create a virtual environment named `venv`:

```python3 -m venv venv```

### 3. Activate the Virtual Environment

Activate the virtual environment using the following command:

```source venv/bin/activate```

### 4. Install Required Packages

To install the required packages, run:

```pip install -r requirements.txt```

### 5. Running the Server

After setting up the virtual environment and installing the required packages, you can run the server using:

```python server.py```

### Note

Ensure that the `venv` folder is added to your `.gitignore` file to prevent it from being included in the repository.

```/venv```

When installing any new python packages, run this command to automatically update requirements.txt:

```./install_and_update.sh <package>```

Happy coding!

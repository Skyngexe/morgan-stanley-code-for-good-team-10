# morgan-stanley-code-for-good-team-10

## Frontend Instructions

### 1. Navigate to frontend folder

In VSCode, open a new terminal. Then, run the following command to navigate to the frontend folder:

```cd frontend```

### 2. Install Node.js packages

If this is your first time opneing this project, run the following command to install node packages. Otherwise, skip this step:

```npm install``` or ```npm i```

### 3. Running the server

Run the following command:

```npm start``` or ```npm run start```

Then, in your web browser type in ```http://localhost:3000```to see the frontend website.

## Backend Instructions

### 1. Navigate to backend folder

In VSCode, open a new split terminal. Then, run the following command to navigate to the backend folder:

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

```python3 server.py```

Then, in your web browser type in ```http://127.0.0.1:5000```to see the backend server.

## Notes

1. Ensure that the `venv` folder is added to your `.gitignore` file to prevent it from being included in the repository.

2. When installing any new python packages, run this command to automatically update requirements.txt: ```./install_and_update.sh <package>```

Happy coding!

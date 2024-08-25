const mockUsers = [
    {
      _id: "1",
      username: "John Doe",
      password: "password123",
      email: "john@example.com",
      number: "12345678",
      role: "volunteer",
      ethnicity: "American",
      gender: "Male",
      age: {
        $numberInt: "30"
      },
      preferred_language: "English",
      points: {
        $numberInt: "500"
      }
    },
    {
      _id: "2",
      username: "Jane Smith",
      password: "password456",
      email: "jane@example.com",
      number: "87654321",
      role: "volunteer",
      ethnicity: "Asian",
      gender: "Female",
      age: {
        $numberInt: "25"
      },
      preferred_language: "English",
      points: {
        $numberInt: "400"
      }
    },
    {
      _id: "3",
      username: "Michael Johnson",
      password: "password789",
      email: "michael@example.com",
      number: "13579246",
      role: "volunteer",
      ethnicity: "African American",
      gender: "Male",
      age: {
        $numberInt: "35"
      },
      preferred_language: "English",
      points: {
        $numberInt: "600"
      }
    },
    {
      _id: "4",
      username: "Emily Davis",
      password: "password101112",
      email: "emily@example.com",
      number: "24680135",
      role: "volunteer",
      ethnicity: "Caucasian",
      gender: "Female",
      age: {
        $numberInt: "28"
      },
      preferred_language: "English",
      points: {
        $numberInt: "450"
      }
    },
    {
      _id: "5",
      username: "David Lee",
      password: "password131415",
      email: "david@example.com",
      number: "97531824",
      role: "volunteer",
      ethnicity: "Asian",
      gender: "Male",
      age: {
        $numberInt: "32"
      },
      preferred_language: "English",
      points: {
        $numberInt: "550"
      }
    }
  ];

  export default mockUsers;
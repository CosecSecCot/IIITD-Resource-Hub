import { User } from "@/data/schema";

const users: User[] = [
  {
    userID: 1,
    name: "Alice Johnson",
    email: "alice@iiitd.ac.in",
    contribution: 10,
    registrationDate: "2024-01-15T08:30:00Z",
  },
  {
    userID: 2,
    name: "Bob Smith",
    email: "bob@iiitd.ac.in",
    contribution: -19,
    registrationDate: "2024-02-10T10:45:00Z",
  },
  {
    userID: 3,
    name: "Charlie Brown",
    email: "charlie@iiitd.ac.in",
    contribution: 20,
    registrationDate: "2023-12-20T14:20:00Z",
  },
  {
    userID: 4,
    name: "David Williams",
    email: "david@iiitd.ac.in",
    contribution: 7,
    registrationDate: "2024-01-25T16:10:00Z",
  },
  {
    userID: 5,
    name: "Eve Adams",
    email: "eve@iiitd.ac.in",
    contribution: 15,
    registrationDate: "2024-02-05T18:55:00Z",
  },
];

export default users;

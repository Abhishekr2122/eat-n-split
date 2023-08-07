import { useState } from "react";
import { Children } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends(function (friends) {
      return [...friends, friend];
    });
    setShowAddFriend(false);
  }

  function handleShowAddFriend() {
    setShowAddFriend(function (show) {
      return !show;
    });
  }

  function handleSelection(friend) {
    setSelectedFriend(function (cur) {
      return cur?.id === friend.id ? null : friend;
    });
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    // setFriends((friends) =>
    //   friends.map((friend) =>
    //     friend.id === selectedFriend.id
    //       ? { ...friend, balance: friend.balance + value }
    //       : friend
    //   )
    // );

    // A variable is said to be undefined when value is not assigned to it.
    // so in the previous code i was not returning the array which is  returned from the friends.map function and the array is the return value of
    // the SetFriends call back function and that value(array) will be set as the value of friends state. So due to it the friends state was
    // undefined as it was not updated with no value and due to it the list element was not rendering as we cannot call the map or any method on
    // an undefined value.

    setFriends(function (friends) {
      return friends.map(function (friend) {
        return friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend;
      });
    });

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          friends={friends}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map(function (friend) {
        return (
          <List
            friend={friend}
            key={friend.id}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
          />
        );
      })}
    </ul>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleName(name) {
    setName(name);
  }

  function handleImage(image) {
    setImage(image);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
      return;
    }
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩‍🤝‍👩🏼Name</label>
      <input
        type="text"
        value={name}
        onChange={function (e) {
          handleName(e.target.value);
        }}
      />

      <label>📷 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={function (e) {
          handleImage(e.target.value);
        }}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill, friends }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByFriend) {
      return;
    }

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
    console.log(friends);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name} </h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={function (e) {
          setBill(Number(e.target.value));
        }}
      />

      <label>🧑 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={function (e) {
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          );
        }}
      />

      <label>👦{selectedFriend.name}s Expense</label>
      <input disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={function (e) {
          setWhoIsPaying(e.target.value);
        }}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

function List({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button
        onClick={function () {
          onSelection(friend);
        }}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

// const initialFriends = [
//   {
//     id: 118836,
//     name: "Clark",
//     image: "https://i.pravatar.cc/48?u=118836",
//     balance: -7,
//   },
//   {
//     id: 933372,
//     name: "Sarah",
//     image: "https://i.pravatar.cc/48?u=933372",
//     balance: 20,
//   },
//   {
//     id: 499476,
//     name: "Anthony",
//     image: "https://i.pravatar.cc/48?u=499476",
//     balance: 0,
//   },
// ];

// function Button({ children, onClick }) {
//   return (
//     <button className="button" onClick={onClick}>
//       {children}
//     </button>
//   );
// }

// export default function App() {
//   const [friends, setFriends] = useState(initialFriends);
//   const [showAddFriend, setShowAddFriend] = useState(false);
//   const [selectedFriend, setSelectedFriend] = useState(null);

//   function handleShowAddFriend() {
//     setShowAddFriend((show) => !show);
//   }

//   function handleAddFriend(friend) {
//     setFriends((friends) => [...friends, friend]);
//     setShowAddFriend(false);
//   }

//   function handleSelection(friend) {
//     // setSelectedFriend(friend);
//     setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
//     setShowAddFriend(false);
//   }

//   function handleSplitBill(value) {
//     setFriends((friends) =>
//       friends.map((friend) =>
//         friend.id === selectedFriend.id
//           ? { ...friend, balance: friend.balance + value }
//           : friend
//       )
//     );

//     setSelectedFriend(null);
//   }

//   return (
//     <div className="app">
//       <div className="sidebar">
//         <FriendsList
//           friends={friends}
//           selectedFriend={selectedFriend}
//           onSelection={handleSelection}
//         />

//         {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

//         <Button onClick={handleShowAddFriend}>
//           {showAddFriend ? "Close" : "Add friend"}
//         </Button>
//       </div>

//       {selectedFriend && (
//         <FormSplitBill
//           selectedFriend={selectedFriend}
//           onSplitBill={handleSplitBill}
//           key={selectedFriend.id}
//         />
//       )}
//     </div>
//   );
// }

// function FriendsList({ friends, onSelection, selectedFriend }) {
//   return (
//     <ul>
//       {friends.map((friend) => (
//         <Friend
//           friend={friend}
//           key={friend.id}
//           selectedFriend={selectedFriend}
//           onSelection={onSelection}
//         />
//       ))}
//     </ul>
//   );
// }

// function Friend({ friend, onSelection, selectedFriend }) {
//   const isSelected = selectedFriend?.id === friend.id;

//   return (
//     <li className={isSelected ? "selected" : ""}>
//       <img src={friend.image} alt={friend.name} />
//       <h3>{friend.name}</h3>

//       {friend.balance < 0 && (
//         <p className="red">
//           You owe {friend.name} {Math.abs(friend.balance)}€
//         </p>
//       )}
//       {friend.balance > 0 && (
//         <p className="green">
//           {friend.name} owes you {Math.abs(friend.balance)}€
//         </p>
//       )}
//       {friend.balance === 0 && <p>You and {friend.name} are even</p>}

//       <Button onClick={() => onSelection(friend)}>
//         {isSelected ? "Close" : "Select"}
//       </Button>
//     </li>
//   );
// }

// function FormAddFriend({ onAddFriend }) {
//   const [name, setName] = useState("");
//   const [image, setImage] = useState("https://i.pravatar.cc/48");

//   function handleSubmit(e) {
//     e.preventDefault();

//     if (!name || !image) return;

//     const id = crypto.randomUUID();
//     const newFriend = {
//       id,
//       name,
//       image: `${image}?=${id}`,
//       balance: 0,
//     };

//     onAddFriend(newFriend);

//     setName("");
//     setImage("https://i.pravatar.cc/48");
//   }

//   return (
//     <form className="form-add-friend" onSubmit={handleSubmit}>
//       <label>👫 Friend name</label>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <label>🌄 Image URL</label>
//       <input
//         type="text"
//         value={image}
//         onChange={(e) => setImage(e.target.value)}
//       />

//       <Button>Add</Button>
//     </form>
//   );
// }

// function FormSplitBill({ selectedFriend, onSplitBill }) {
//   const [bill, setBill] = useState("");
//   const [paidByUser, setPaidByUser] = useState("");
//   const paidByFriend = bill ? bill - paidByUser : "";
//   const [whoIsPaying, setWhoIsPaying] = useState("user");

//   function handleSubmit(e) {
//     e.preventDefault();

//     if (!bill || !paidByUser) return;
//     onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
//   }

//   return (
//     <form className="form-split-bill" onSubmit={handleSubmit}>
//       <h2>Split a bill with {selectedFriend.name}</h2>

//       <label>💰 Bill value</label>
//       <input
//         type="text"
//         value={bill}
//         onChange={(e) => setBill(Number(e.target.value))}
//       />

//       <label>🧍‍♀️ Your expense</label>
//       <input
//         type="text"
//         value={paidByUser}
//         onChange={(e) =>
//           setPaidByUser(
//             Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
//           )
//         }
//       />

//       <label>👫 {selectedFriend.name}'s expense</label>
//       <input type="text" disabled value={paidByFriend} />

//       <label>🤑 Who is paying the bill</label>
//       <select
//         value={whoIsPaying}
//         onChange={(e) => setWhoIsPaying(e.target.value)}
//       >
//         <option value="user">You</option>
//         <option value="friend">{selectedFriend.name}</option>
//       </select>

//       <Button>Split bill</Button>
//     </form>
//   );
// }

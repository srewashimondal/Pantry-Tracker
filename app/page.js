"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "./firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore";

export default function Home() {
  // State variables
  const [inventory, setInventory] = useState([]); // State to store inventory items
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [itemName, setItemName] = useState(''); // State to store the name of the item to be added

  // Function to update the inventory by fetching data from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory')); // Query the 'inventory' collection
    const docs = await getDocs(snapshot); // Get the documents in the collection
    const inventoryList = []; // Initialize an empty array to store inventory items
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id, // Use document ID as the item name
        ...doc.data(), // Spread the document data
      });
    });
    setInventory(inventoryList); // Update the state with the fetched inventory
  };

  // Function to add an item to the inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item); // Reference to the document for the item
    const docSnap = await getDoc(docRef); // Fetch the document snapshot
    if (docSnap.exists()) {
      const { quantity } = docSnap.data(); // Get the quantity from the document data
      await setDoc(docRef, { quantity: quantity + 1 }); // Update the quantity if the item exists
    } else {
      await setDoc(docRef, { quantity: 1 }); // Set the initial quantity if the item doesn't exist
    }
    await updateInventory(); // Update the inventory state
  };

  // Function to remove an item from the inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item); // Reference to the document for the item
    const docSnap = await getDoc(docRef); // Fetch the document snapshot

    if (docSnap.exists()) {
      const { quantity } = docSnap.data(); // Get the quantity from the document data
      if (quantity == 1) {
        await deleteDoc(docRef); // Delete the document if quantity is 1
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }); // Decrease the quantity if greater than 1
      }
    }
    await updateInventory(); // Update the inventory state
  };

  // Effect to update inventory when component mounts
  useEffect(() => {
    updateInventory(); // Call updateInventory when the component mounts
  }, []); // Empty dependency array means this runs once on mount

  // Handlers for modal open and close
  const handleOpen = () => setOpen(true); // Function to open the modal
  const handleClose = () => setOpen(false); // Function to close the modal

  return (
    <Box
      width="100vw" // Set the width to 100% of the viewport width
      height="100vh" // Set the height to 100% of the viewport height
      display={'flex'} // Use flexbox for layout
      justifyContent={'center'} // Center the content horizontally
      flexDirection={'column'} // Arrange children in a column
      alignItems={'center'} // Center the content vertically
      gap ={2} // Set gap between children
    >
      {/* Modal for adding a new item */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position={'absolute'} // Position the box absolutely
          top={'50%'} // Center the box vertically
          left={'50%'} // Center the box horizontally
          width={400} // Set the width of the box
          bgcolor={"white"} // Set background color to white
          border={"2px solid #000"} // Add a border to the box
          boxShadow={24} // Add a shadow to the box
          p={4} // Add padding
          display={'flex'} // Use flexbox for layout
          flexDirection={'column'} // Arrange children in a column
          gap={3} // Set gap between children
          sx={{
            transform:"translate(-50%,-50%)", // Center the box using transform
          }}
        >
          <Typography variant='h6'>Add item</Typography> {/* Modal title */}
          <Stack width={"100%"} direction={"row"} spacing={2}> {/* Stack for input and button */}
            <TextField 
              variant="outlined" 
              fullWidth 
              value={itemName} // Bind TextField value to itemName state
              onChange={(e) => setItemName(e.target.value)} // Update itemName state on change
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName); // Call addItem with itemName
                setItemName(''); // Reset itemName state
                handleClose(); // Close the modal
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      
      {/* Button to open the modal */}
      <Button
        variant="contained"
        onClick={handleOpen} // Open the modal on button click
      >
        Add New Item
      </Button>
      
      {/* Container for inventory items */}
      <Box border="1px solid #333">
        <Box
          width="800px" // Set the width of the inner box
          height="100px" // Set the height of the inner box
          bgcolor={"#ADD8E6"} // Set background color
          display={'flex'} // Use flexbox for layout
          alignItems={'center'} // Center content vertically
          justifyContent={'center'} // Center content horizontally
        >
          <Typography variant="h2" color ='#333'>Inventory Management</Typography> {/* Title */}
        </Box>
        
        {/* Stack to list inventory items */}
        <Stack width="800px" height={"300px"} spacing={2} overflow={"auto"}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name} // Unique key for each item
              width="100%" 
              minHeight={"150px"}
              display={"flex"} // Use flexbox for layout
              alignItems="center" // Center content vertically
              justifyContent={"space-between"} // Space content evenly
              bgcolor={"#f0f0f0"} // Set background color
              padding={5} // Add padding
            >
              <Typography variant='h3' color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)} {/* Capitalize first letter */}
              </Typography>
              <Typography variant='h3' color={'#333'} textAlign={'center'}>
                {quantity}
              </Typography>
              <Stack direction={'row'} spacing={2}> {/* Stack for add and remove buttons */}
                <Button
                  variant="contained"
                  onClick={() => addItem(name)} // Add item on button click
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)} // Remove item on button click
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
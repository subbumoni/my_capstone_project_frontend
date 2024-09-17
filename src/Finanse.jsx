import { useState, useEffect } from "react";
import {
  Container,
  Card,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

function Finanse() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const response = await axios.get(
      "https://backend-backend-1.onrender.com/api/transactions"
    );
    setTransactions(response.data);
    calculateTotals(response.data);
  };

  const calculateTotals = (transactions) => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.amount > 0) {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });
    setTotalIncome(income);
    setTotalExpense(Math.abs(expense));
    setTotalBalance(income - Math.abs(expense));
  };

  const addTransaction = async () => {
    if (description && amount) {
      const newTransaction = {
        description,
        amount: parseFloat(amount),
        
      };
      console.log(newTransaction); //Add this line

      // Check if the new transaction is an expense and if it exceeds the total income
      if (
        newTransaction.amount < 0 &&
        totalIncome + newTransaction.amount < totalExpense
      ) {
        alert("Expense exceeds total income!");
        return;
      }

      await axios.post(
        "https://backend-backend-1.onrender.com/api/transactions/addtransaction",
        newTransaction
      );
      setDescription("");
      setAmount("");
      fetchTransactions();
    }
  };

  const updateTransaction = async () => {
    if (editTransaction && description && amount) {
      const updatedTransaction = {
        ...editTransaction,
        description, //Update the description
        amount: parseFloat(amount), //Update the amount
      };
      await axios.put(
        `https://backend-backend-1.onrender.com/api/transactions/${editTransaction._id}`,
        updatedTransaction
      );
      setDescription("");
      setAmount("");
      setEditTransaction(null);
      setEditMode(false);
      setOpenDialog(false); //Close the dialog after updating
      fetchTransactions();
    }
  };

  const deleteTransaction = async (id) => {
    await axios.delete(
      `https://backend-backend-1.onrender.com/api/transactions/${id}`
    );
    fetchTransactions();
  };

  const openEditDialog = (transaction) => {
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setEditTransaction(transaction);
    setEditMode(true);
    setOpenDialog(true);
  };

  return (
    <Container>
      <Card sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h4" gutterBottom>
          Finance Tracker
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "lightgreen",
              padding: 2,
              borderRadius: 1,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Total Balance</Typography>
            <Typography variant="h4">${totalBalance.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "green",
              padding: 2,
              borderRadius: 1,
              width: "48%",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Income</Typography>
            <Typography variant="h4">${totalIncome.toFixed(2)}</Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "red",
              padding: 2,
              borderRadius: 1,
              width: "48%",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Expense</Typography>
            <Typography variant="h4">${totalExpense.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={editMode ? updateTransaction : addTransaction}
          >
            {editMode ? "Update Transaction" : "Add Transaction"}
          </Button>
        </Box>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            Transaction History
          </Typography>
          {transactions.map((t) => (
            <Box
              key={t._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 1,
                borderBottom: "1px solid #ddd",
              }}
            >
              <Typography
                sx={{
                  color: t.amount > 0 ? "green" : "red", // Green for income, red for expense
                }}
              >
                {t.description} - ${t.amount.toFixed(2)}
              </Typography>
              <Box>
                <IconButton onClick={() => openEditDialog(t)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteTransaction(t._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditTransaction(null);
              setEditMode(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={updateTransaction} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Finanse;

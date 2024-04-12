import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Select, Radio, RadioGroup, Stack, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const initialTransactions = [
  { id: 1, date: "2023-06-01", amount: 1000, type: "income", category: "Salary" },
  { id: 2, date: "2023-06-02", amount: 50, type: "expense", category: "Groceries" },
  { id: 3, date: "2023-06-03", amount: 100, type: "expense", category: "Bills" },
];

const Index = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [formData, setFormData] = useState({
    id: null,
    date: "",
    amount: "",
    type: "income",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update existing transaction
      const updatedTransactions = transactions.map((transaction) => (transaction.id === formData.id ? formData : transaction));
      setTransactions(updatedTransactions);
    } else {
      // Add new transaction
      const newTransaction = { ...formData, id: Date.now() };
      setTransactions([...transactions, newTransaction]);
    }
    resetForm();
  };

  const handleEdit = (transaction) => {
    setFormData(transaction);
  };

  const handleDelete = (id) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(updatedTransactions);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      date: "",
      amount: "",
      type: "income",
      category: "",
    });
  };

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Date</FormLabel>
          <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Amount</FormLabel>
          <Input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Type</FormLabel>
          <RadioGroup name="type" value={formData.type} onChange={(value) => setFormData({ ...formData, type: value })}>
            <Stack direction="row">
              <Radio value="income">Income</Radio>
              <Radio value="expense">Expense</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Category</FormLabel>
          <Select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select category</option>
            <option value="Groceries">Groceries</option>
            <option value="Bills">Bills</option>
            <option value="Salary">Salary</option>
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="blue" leftIcon={<FaPlus />}>
          {formData.id ? "Update" : "Add"}
        </Button>
      </form>

      <Table mt={8}>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Type</Th>
            <Th>Category</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>{transaction.date}</Td>
              <Td>{transaction.amount}</Td>
              <Td>{transaction.type}</Td>
              <Td>{transaction.category}</Td>
              <Td>
                <IconButton icon={<FaEdit />} aria-label="Edit" onClick={() => handleEdit(transaction)} mr={2} />
                <IconButton icon={<FaTrash />} aria-label="Delete" onClick={() => handleDelete(transaction.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Index;

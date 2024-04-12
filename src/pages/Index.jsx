import React, { useState, useMemo } from "react";
import { Box, Button, FormControl, FormLabel, Input, Select, Radio, RadioGroup, Stack, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure, Text } from "@chakra-ui/react";
import TransactionModal from "../components/TransactionModal";
import { FaPlus, FaEdit, FaTrash, FaFilter, FaDownload } from "react-icons/fa";

const initialTransactions = [
  { id: 1, date: "2023-06-01", amount: 1000, type: "income", category: "Salary" },
  { id: 2, date: "2023-06-02", amount: 50, type: "expense", category: "Groceries" },
  { id: 3, date: "2023-06-03", amount: 100, type: "expense", category: "Bills" },
];

const Index = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: Date.now() };
    setTransactions([...transactions, newTransaction]);
  };

  const [editFormData, setEditFormData] = useState({
    id: null,
    date: "",
    amount: "",
    type: "income",
    category: "",
  });
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    fromDate: "",
    toDate: "",
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set(transactions.map((transaction) => transaction.category));
    return ["all", ...uniqueCategories];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (filters.type !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === filters.type);
    }
    if (filters.category !== "all") {
      filtered = filtered.filter((transaction) => transaction.category === filters.category);
    }
    if (filters.fromDate) {
      filtered = filtered.filter((transaction) => transaction.date >= filters.fromDate);
    }
    if (filters.toDate) {
      filtered = filtered.filter((transaction) => transaction.date <= filters.toDate);
    }
    return filtered;
  }, [transactions, filters]);

  const calculateBalance = (transactions) => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === "income" ? total + transaction.amount : total - transaction.amount;
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const balance = useMemo(() => calculateBalance(filteredTransactions), [filteredTransactions]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    setTransactions([...transactions]);
  };

  const handleEdit = (transaction) => {
    setEditFormData(transaction);
  };

  const handleDelete = (id) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(updatedTransactions);
  };

  const resetEditForm = () => {
    setEditFormData({
      id: null,
      date: "",
      amount: "",
      type: "income",
      category: "",
    });
  };

  const handleExport = () => {
    const today = new Date().toISOString().slice(0, 10);
    const filename = `transactions_${today}.json`;
    downloadJSON(filteredTransactions, filename);
  };

  const downloadJSON = (data, filename) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <Box bg={balance >= 0 ? "green.500" : "red.500"} p={4} mb={8} borderRadius="md">
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Balance: {formatCurrency(balance)}
        </Text>
      </Box>
      <Box bg={balance >= 0 ? "green.500" : "red.500"} p={4} mb={8} borderRadius="md">
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Balance: {formatCurrency(balance)}
        </Text>
      </Box>
      <TransactionModal isOpen={isOpen} onClose={onClose} onSubmit={addTransaction} />
      <Stack direction="row" spacing={4} mb={4}>
        <Button colorScheme="blue" leftIcon={<FaPlus />} onClick={onOpen}>
          Add Transaction
        </Button>
        <Button colorScheme="green" leftIcon={<FaDownload />} onClick={handleExport}>
          Export
        </Button>
      </Stack>

      <Box mt={8} mb={4}>
        <Stack direction="row" spacing={4} mb={4}>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <RadioGroup name="type" value={filters.type} onChange={handleFilterChange}>
              <Stack direction="row">
                <Radio value="all">All</Radio>
                <Radio value="income">Income</Radio>
                <Radio value="expense">Expense</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select name="category" value={filters.category} onChange={handleFilterChange}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>From Date</FormLabel>
            <Input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
          </FormControl>
          <FormControl>
            <FormLabel>To Date</FormLabel>
            <Input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
          </FormControl>
          <Button colorScheme="blue" leftIcon={<FaFilter />} onClick={handleFilter}>
            Filter
          </Button>
        </Stack>
      </Box>

      <Table>
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
          {filteredTransactions.map((transaction) => (
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

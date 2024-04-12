import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, Radio, RadioGroup, Stack, Button } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const TransactionModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
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
    onSubmit(formData);
    setFormData({
      date: "",
      amount: "",
      type: "income",
      category: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} leftIcon={<FaPlus />}>
            Add
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionModal;

import React, { useState } from 'react';
import styled from 'styled-components';
const API_url = import.meta.env.VITE_APP_URL;
import Button from './FormComponents/Button';
import Form from './FormComponents/Form';
import Input from './FormComponents/Input';


const CrimesWithNoLocation = ({ forceId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [date, setDate] = useState('');
  const [category, setCategory] = useState('all-crime');
  const [crimes, setCrimes] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCrimes = crimes ? crimes.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPageNumbers = crimes ? Math.ceil(crimes.length / itemsPerPage) : 0;


  const categories = [
    { url: 'all-crime', name: 'All crime' },
    { url: 'anti-social-behaviour', name: 'Anti-social behaviour' },
    { url: 'bicycle-theft', name: 'Bicycle theft' },
    { url: 'burglary', name: 'Burglary' },
    { url: 'criminal-damage-arson', name: 'Criminal damage and arson' },
    { url: 'drugs', name: 'Drugs' },
    { url: 'other-theft', name: 'Other theft' },
    { url: 'possession-of-weapons', name: 'Possession of weapons' },
    { url: 'public-order', name: 'Public order' },
    { url: 'robbery', name: 'Robbery' },
    { url: 'shoplifting', name: 'Shoplifting' },
    { url: 'theft-from-the-person', name: 'Theft from the person' },
    { url: 'vehicle-crime', name: 'Vehicle crime' },
    { url: 'violent-crime', name: 'Violence and sexual offences' },
    { url: 'other-crime', name: 'Other crime' },
  ];



  const handleSubmit = async (event) => {
    event.preventDefault();
    let url = `${API_url}/crimes-no-location?category=${category}&force=${forceId}`;
    if (date) url += `&date=${date}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Directly parse the response as JSON
      setCrimes(data);
    } catch (error) {
      console.error('Error fetching crimes with no location:', error);
    }
  };


  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="date">Date (optional):</Label>
        <Input
          type="month"
          id="date"
          value={date}
          placeholder='YYYY-MM'
          onChange={(e) => setDate(e.target.value)}
        />
        <Label htmlFor="category">Category:</Label>
        <Select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.url} value={cat.url}>{cat.name}</option>
          ))}
        </Select>
        <Button text="Fetch Crimes"
          color="#FFF"
          type="submit">Fetch Crimes</Button>
      </Form>
      {crimes && crimes.length > 0 ? (
        <CrimeList>
          {currentCrimes.map((crime, index) => (
            <CrimeItem key={index}>
              <CrimeHeader>Crime ID: {crime.id}</CrimeHeader>
              <CrimeDetail>Category: {crime.category}</CrimeDetail>
              <CrimeDetail>Outcome: {crime.outcome_status?.category || 'N/A'}</CrimeDetail>
              <CrimeDetail>Date of Outcome: {crime.outcome_status?.date || 'N/A'}</CrimeDetail>
            </CrimeItem>
          ))}
        </CrimeList>
      ) : (
        <p>No crimes to display.</p>
      )}


      <div>
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(1)}>First</button>
        )}
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        )}

        {/* Display current page number and total pages, e.g., "Page 3 of 10" */}
        <span>Page {currentPage} of {totalPageNumbers}</span>

        {currentPage < totalPageNumbers && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        )}
        {currentPage < totalPageNumbers && (
          <button onClick={() => setCurrentPage(totalPageNumbers)}>Last</button>
        )}
      </div>
    </div>
  );
};




const Label = styled.label`
  font-weight: bold;
`;


const Select = styled.select`
  padding: 5px;
`;



const CrimeList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CrimeItem = styled.li`
  background-color: #f0f0f0;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
`;

const CrimeHeader = styled.h3`
  margin: 0;
  color: #333;
`;

const CrimeDetail = styled.p`
  margin: 5px 0;
`;

export default CrimesWithNoLocation;
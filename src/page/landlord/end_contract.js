import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import HouseRentalContract from '../../artifacts/contracts/UpdatedRentalContract.sol/HouseRentalContract.json';
import axios from 'axios';
import { ethers } from 'ethers';

const EndContract = () => {
    const location = useLocation();
    const houseId = location.state?.houseId; 
    const [contractId, setContractId] = useState('');
    const [depositBalance, setDepositBalance] = useState(0);
    const [contract, setContract] = useState(null);
    const [error, setError] = useState('');

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractAbi = HouseRentalContract.abi;

    useEffect(() => {
        const init = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const userSigner = await provider.getSigner();
                const rentalContract = new ethers.Contract(contractAddress, contractAbi, userSigner);
                setContract(rentalContract);

                // Fetch the contractId from the server
                const response = await axios.get(`http://127.0.0.1:8000/api/get-UniIdentifier/${houseId}`);
                setContractId(response.data.uni_identifier);
            } else {
                setError('Please install MetaMask!');
            }
        };

        init();
    }, [houseId]);

    useEffect(() => {
        const fetchDepositBalance = async () => {
            if (contract && contractId) {
                try {
                    const balance = await contract.getDepositBalance(contractId);
                    setDepositBalance(ethers.formatEther(balance));
                } catch (err) {
                    console.error(err);
                    setError('Error fetching deposit balance');
                }
            }
        };

        fetchDepositBalance();
    }, [contract, contractId]);

    const handleReleaseDeposit = async () => {
        if (contract && contractId) {
            try {
                const tx = await contract.refundDeposit(contractId);
                await tx.wait();
                console.log('Deposit released successfully');
                setDepositBalance(0); // Assuming the entire deposit is refunded
            } catch (err) {
                console.error('Error releasing deposit', err);
                setError('Error releasing deposit');
            }
        }
    };

    const handleEndContract = async () => {
        if (window.confirm('Are you sure you want to end this contract?')) {
            try {
                await axios.put(`http://127.0.0.1:8000/api/update-rent-house/${houseId}`, { contract_status: 'Contract Ended' });

                if (contract && contractId) {
                    const tx = await contract.endContract(contractId);
                    await tx.wait();
                    console.log('Successfully ended contract. Contract Id:', contractId);
                }
            } catch (error) {
                console.error('Error ending contract', error);
                setError('Error ending contract');
            }
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
             <p><strong>Deposit Balance:</strong> {depositBalance} ETH</p>
            <div className="btn-group">
               
                <button className="btn btn-primary" onClick={handleReleaseDeposit}>
                    Release Deposit
                </button>
                <button className="btn btn-danger ml-2" onClick={handleEndContract}>
                    End Contract
                </button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default EndContract;

import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function AddSales({ addNewSale }) {
    const navigate = useNavigate()
    const [product, setProduct] = useState("");
    const [price, setPrice] = useState("");
    const [profitInPercent, setProfitInPercent] = useState("");
    const [qty, setQty] = useState("");
    const [date, setDate] = useState("");
    const [inventory, setInventory] = useState([]); 
    const [isPopupVisible, setPopupVisible] = useState(false); 

    const fetchInventory = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/inventory/get-item', { withCredentials: true });
            setInventory(response.data.data);
        } catch (error) {
            console.error('Failed to fetch inventory items:', error);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const handleAddSales = async (e) => {
        e.preventDefault();
        const data = { product, price, profitInPercent, qty, date };

        try {
            const response = await axios.post('http://localhost:8000/api/v1/sales/add-sale', data, { withCredentials: true });

            if (response.status === 201) {
                console.log("Product added to sales");

                addNewSale(response.data.data);
                setPopupVisible(true);

                setProduct("");
                setPrice("");
                setProfitInPercent("");
                setQty("");
                setDate("");
            }
            console.log(response.data.message);
        } catch (error) {
            console.error("Error while adding product", error.response?.data || error.message);
        }
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
        window.location.reload();
    };

    return (
        <>
            <form onSubmit={handleAddSales} className="space-y-4 mb-2">
                <select 
                    id="product" 
                    value={product} 
                    onChange={(e) => setProduct(e.target.value)} 
                    required
                    className="w-1/5 bg-[#2b2b2e] shadow-xl  text-center font-poppins font-normal text-white h-10 m-2 rounded-2xl "
                >
                    <option value="" disabled>Select a product</option>
                    {inventory.map((item) => (
                        <option className="font-poppins bg-[#2b2b2e] shadow-xl text-white font-normal" key={item._id} value={item._id}>
                            {item.item} - (Stock In: {item.stockRemain})
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-1/5 text-center bg-[#2b2b2e] shadow-xl h-10 m-2 rounded-2xl font-poppins font-normal text-white"
                />

                <input
                    type="text"
                    placeholder="Profit %"
                    value={profitInPercent}
                    onChange={(e) => setProfitInPercent(e.target.value)}
                    required
                    className="w-1/12 text-center h-10 m-2 bg-[#2b2b2e] shadow-xl rounded-2xl  font-poppins font-normal text-white"
                />

                <input
                    type="text"
                    placeholder="Qty"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                    className="w-1/12 text-center h-10 m-2 rounded-2xl bg-[#2b2b2e] shadow-xl  font-poppins font-normal text-white"
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-1/5 text-center pr-4 h-10 m-2 rounded-2xl  bg-[#2b2b2e] shadow-xl font-poppins font-normal text-white"
                />

                <button type="submit" className="bg-white hover:bg-blue-200 text-black px-4 py-2 rounded-xl">Add Sale</button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] rounded p-6 max-w-sm w-full">
                        <h2 className="text-lg font-poppins text-white font-bold">Success!</h2>
                        <p className="mt-2 font-poppins text-white">Product added to sales successfully.</p>
                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={handleClosePopup} 
                                className="font-poppins font-bold text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddSales;
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const Management = ({isLoggedIn, isManager}) => {
    const [itemName, setItemName] = React.useState('');
    const [itemPrice, setItemPrice] = React.useState('');
    const [error, setError] = React.useState('');
    const [displayItemsError, setDisplayItemsError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [items, setItems] = React.useState([]);


    const fetchItems = () => {
        axios.get('api/getAllItems')
        .then((res) => {
            setItems(res.data.items);
        })
        .catch(() => {
            setDisplayItemsError('Error displaying Items');
        });
    }//end fetchItems

    // display items
    const Items = ({ items }) => {
        return(
            <div className='items-list'>
                {items.map((item) => {
                    return (
                    <div className='items-list-item' key='item'>
                        {item} <button onClick={() => deleteItem(item)}>delete</button>
                    </div>
                    );
                })}
            </div>
        );
    };
    const deleteItem = (i) => {
        var name = i.split(" :");
        const body = name[0];
        axios.post('api/removeItem', body)
        .then((res) => {
            if(res.data.error){
                setMessage(null);
                setError(res.data.error);
            }
            else{
                setError(null);
                setMessage('Deleted item from shop!');
                fetchItems();
            }
        })
        .catch(() => {
            console.log('failed to delete item');
        });
    }// end deleteItem

    const handleAddItem = () => {
        const body = {
            itemName: itemName,
            itemPrice: itemPrice,
        };
        axios.post('api/addItem', body)
        .then((res) => {
            if(res.data.error){
                setMessage(null);
                setError(res.data.error);
            }
            else{
                setError(null);
                setMessage('Added item to shop!');
                fetchItems();
            }
        })
        .catch(() => {
            setError('Failed to add item');
        });
    }//end handleAddItem


    //Display the items when page is loaded
    React.useEffect(() => {
        fetchItems();
    }, []);

    // You can only be in this page if you're logged in and a manager
    if(!(isLoggedIn && isManager)) return <Redirect to="/" />

    return(
            <div id="management">
                <div id="add-item-form">
                    <h1>Inventory</h1>
                        <div>
                            Item : &nbsp;
                            <input
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            />
                        </div>
                        <div>
                            Price: &nbsp;
                        <input
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            />
                        </div>
                    <div>
                        <button onClick={handleAddItem}>Add Item</button>
                    </div>
                </div>

                {error && <strong>{error}</strong>}
                {displayItemsError && <strong>{displayItemsError}</strong>}
                {message && <strong>{message}</strong>}

                <div>
                    <Items items={items} />
                </div>
            </div>
    );
};

export default Management;
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const Shop = ({isLoggedIn}) => {
    const [cartItems, setCartItems] = React.useState([]);
    const [items, setItems] = React.useState([]);
    const [displayItemsError, setDisplayItemsError] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [transactionsList, setTransactionsList] = React.useState([]);

    // fetch all items in inventory from DB
    const fetchItems = () => {
        axios.get('api/getAllTransactions')
        .then((res) => {
            setTransactionsList(res.data.items);
        }).catch(() => {
            setDisplayItemsError('Error displaying Transactions');
        });

        axios.get('api/getAllItems')
        .then((res) => {
            setItems(res.data.items);
        })
        .catch(() => {
            setDisplayItemsError('Error displaying Items');
        });



    }//end fetchItems

    // a list of all items fetched from DB
    const Items = ({ items }) => {
        return(
            <div className='items-list'>
                {items.map((item) => {
                    return (
                    <div className='items-list-item' key={item}>
                        {item} <button onClick={() => addToCart(item)}>add</button>
                    </div>
                    );
                })}
            </div>
        );
    };
    const Cart = ({ cartItems }) => {
        return(
            <div className='items-list'>
                {cartItems.map((item) => {
                    return (
                    <div className='items-list-item'>
                        {item}
                    </div>
                    );
                })}
            </div>
        );
    };

    const Transactions = ( { transactionsList } )  => {
        return(
            <div className='items-list'>
                { (transactionsList).map((item) => {
                    return (
                    <div className='items-list-item'>
                        {item}
                    </div>
                    );
                }) }
            </div>
        );
    };

    const addToCart = (i) => {
        var name = i.split(" :");
        const body = name[0];
        axios.post('api/getItem', body)
        .then((res) => {
            if(res.data.error){
                setMessage(null);
                setError(res.data.error);
                console.log(error);
            }
            else{
                setError(null);
                setMessage('Added item to cart!');
                let totalItem = (res.data.itemName) + " : $" + (res.data.itemPrice);
                cartItems.push(totalItem); // apend to array
                fetchItems();
            }
        })
    }

    const handleCreateTransaction = () => {
        axios.post('api/createTransaction', cartItems)
        .then((res) => {
            if(res.data.error){
                setMessage(null);
                setError(res.data.error);
            }
            else{
                setError(null);
                setMessage('Transaction Complete!');
                fetchItems();
                setCartItems([]);
            }
        })
        .catch(() => {
            setError('Failed to create transaction!');
        });
    }//end handleCreateTransaction


    //Display the items when page is loaded
    React.useEffect(() => {
        fetchItems();
        setCartItems(cartItems);
    }, []);

    // if you're not logged in, you can't visit the shop
    if(!isLoggedIn) return <Redirect to="/" />

    return(
        <div>
            <h1>Kwik-E-Mart</h1>
            <table>
                <td width="400px">
                    <h1>Shop</h1>
                    <div>
                        <Items items={items} />
                    </div>
                </td>
                <td width="400px">
                    <h1>Cart</h1>
                    <div>
                        <Cart cartItems={cartItems} />
                        <button onClick={handleCreateTransaction}>Checkout</button>
                    </div>
                </td>
                <td width="400px">
                    <h1>Transactions</h1>
                    <div>
                        <Transactions transactionsList={transactionsList} />
                    </div>
                </td>
            </table>
            {error && <strong>{error}</strong>}
            {displayItemsError && <strong>{displayItemsError}</strong>}
            {message && <strong>{message}</strong>}
        </div>
    );
};

export default Shop;
import React,{useState,useRef} from "react"
import Cart from "./components/Cart"
import Menu from "./components/Menu"
import Items from "./components/Items"
import {FaRegTimesCircle} from 'react-icons/fa'
import { gsap } from "gsap";

export default function CartApp() {
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(true)
    const [currentCategory, setCurrentCategory] = useState('all')
    const [search,setSearch] = useState('')
    const [priceFilter,setPriceFilter] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage,setPostsPerPage] = useState(6)
    const searchRef = useRef()
  
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const lastPage = currentCategory === 'all' ? 
    Math.ceil(Items.filter(item => (search ? item.name.toLowerCase().includes(search.toLowerCase()): item)).length / postsPerPage) :
    Math.ceil((Items
        .filter(item => (item.category === currentCategory))
        .filter(item => (search ? item.name.toLowerCase().includes(search.toLowerCase()) 
        : item))).length / postsPerPage)
  
    function total() {
        if (cart.length === 0) { return 0 }
        else {
            let amount = cart.reduce((prevValue, currValue) =>
                prevValue + currValue.price * 100 * currValue.qty, 0
            ) / 100
            return amount.toFixed(2)
        }
    }
  
    function toggle(id) {
        for (let cartItem of cart) {
            if (id === cartItem.id) {
                console.log("Item has already been added to cart")                
                return;
            }
        }
        console.log("Item added")
        setCart(prevState => {
            for (let item of Items) {
                if (id === item.id) {
                    item.qty=1
                    return [...prevState,item]
                }
            }
        })
        let CICT = gsap.timeline()
        CICT.to(".cart-item-count",{y: -25,rotation: "+=360",duration: 0.4})
        CICT.to(".cart-item-count",{y: 0, duration: 0.4,ease: "bounce.out"})       
    }
  
    function add(id) {
        console.log("Item qty increased")
        setCart(prevState => {
            return prevState.map(item => {
                return item.id === id ? { ...item, qty: item.qty + 1 } : item
            })
        })        
    }
  
    function subtract(id) {
        console.log("Item qty decreased")
        for (let cartItem of cart) {
            if (id === cartItem.id && cartItem.qty === 1) {
                setCart(prevState => prevState.filter(item => item.id !== id))
            }
        }
        setCart(prevState => {
            return prevState.map(item => {
                return item.id === id ? { ...item, qty: item.qty - 1 } : item
            })
        })
    }
  
    function chooseCategory(category) {
        setCurrentCategory(category)
        setCurrentPage(1)
    }
  
    function checkout() {
        alert("Thanks for shopping with us")
    }
  
    function handleSearch(e) {
        e.preventDefault()
        setCurrentPage(1)
        setSearch(searchRef.current.value)
        e.target.reset()
    }
  
    function cartAnimation() {
        if (showCart) {
            gsap.fromTo(".cart-items",{autoAlpha: 0, y: 400, scale: 0.5}, {autoAlpha: 1, duration: 1, y: 0, scale: 1, ease: "Power2.easeInOut"})
            setShowCart(false)
        } else {
            gsap.fromTo(".cart-items",{autoAlpha: 1, y: 0, scale: 1}, {autoAlpha: 0, duration: 1, y: 400, scale: 0.5})
            setShowCart(true)
        }
    }
  
    const cartItems = cart.map(item => {
        return (
            <Cart
                key={item.id}
                name={item.name}
                price={item.price}
                qty={item.qty}
                add={() => { add(item.id)}}
                subtract={() => { subtract(item.id)}}
            />
        )
    })
    const itemsByCategory = (currentCategory === 'all') ? Items : Items.filter(item => (item.category === currentCategory))
    const itemsByPrice = 
        priceFilter === 'ascending' ? itemsByCategory.sort(function (a, b) {
        return a.price - b.price;
      }) : priceFilter === 'descending' ? itemsByCategory.sort(function (a, b) {
        return b.price - a.price;
      }) : itemsByCategory
  
    const menuItems = 
        itemsByPrice
        .filter(item => (search ? item.name.toLowerCase().includes(search.toLowerCase()) : item))
        .slice(indexOfFirstPost,indexOfLastPost)
        .map(item => {
            return (
                <Menu
                    key={item.id}
                    img={item.img}
                    name={item.name}
                    price={item.price}
                    toggle={() => { toggle(item.id) }}
                />
            )
        })
    
  
    return (
        <div className="cart-app">
            <div className="menu">
                <div className="category-section">
                    <button onClick={() => chooseCategory('all')} className="category">{currentCategory === 'all' ? <u><b>All</b></u> : "All" }</button>
                    <button onClick={() => chooseCategory('food')} className="category">{currentCategory === 'food' ? <u><b>Food</b></u> : "Food" }</button>
                    <button onClick={() => chooseCategory('fruits')} className="category">{currentCategory === 'fruits' ? <u><b>Fruits</b></u> : "Fruits" }</button>
                    <button onClick={() => chooseCategory('furniture')} className="category">{currentCategory === 'furniture' ? <u><b>Furniture</b></u> : "Furniture" }</button>
                    <div className="filters">
                        <span className="item-count">Showing &nbsp;
                        <select onChange={(e) => setPostsPerPage(e.target.value === "all" ? 1000:e.target.value)}>
                            <option value="6">6</option>
                            <option value="9">9</option>
                            <option value="all">all</option>
                        </select>
                            &nbsp; items per page</span><br />
                        <span className="filter">Filter by price from &nbsp;
                            <select onChange={(e) => setPriceFilter(e.target.value)}>
                                <option value= "null" >--</option>
                                <option value="ascending">Lowest to Highest</option>
                                <option value="descending">Highest to Lowest</option>
                            </select>
                        </span>
                    </div>
                </div>
                <div className="menu-items">
                    {menuItems}
                    {(search && menuItems.length === 0) && 
                    <div className="found-nothing">We found nothing for you :(</div>}
                </div>
                <button 
                  className="page-button"
                  disabled={currentPage === 1 || menuItems.length === 0} 
                  onClick={() =>setCurrentPage(page => page - 1)}
                >Previous</button>
                <button 
                  className="page-button"
                  disabled={currentPage === lastPage || menuItems.length === 0} 
                  onClick={() =>setCurrentPage(page => page + 1)}
                >Next</button>
            </div>
          <div className="cart">
                <form onSubmit={handleSearch}>
                    <label htmlFor="search">What are you looking for?</label><br />
                    <input type="text" ref={searchRef} id="search" name="search" required/>
                    <button type="submit">Search</button>
                </form>
                {search && 
                <div className="current-search-bar">
                  <span className="current-search">Current search: {search}</span> 
                <span className="clear-search" onClick={() => setSearch('')}><FaRegTimesCircle /></span>
                </div>
                }
                <div className="cart-items">
                <h2 className="ul">Shopping Cart</h2>
                {cartItems}
                {cartItems.length === 0 ?
                    <h3>Your cart is empty</h3> :
                    <h3>Total: ${total()}</h3>
                }
                {cartItems.length !== 0 && <button onClick={checkout}>Checkout</button>}
                </div>
                
                <div onClick={()=> cartAnimation()} className="cart-image">
                    {cartItems.length !== 0 && <p className="cart-item-count">{cartItems.length}</p>}
                    <img src="./images/cart.svg" alt=""/>
                </div>
          </div>
        </div>
        )
    }

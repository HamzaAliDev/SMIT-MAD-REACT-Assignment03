import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';

const Wishlist = createContext();

export default function WishListContext({ children }) {
  const [dataList, setDataList] = useState([]);
  const [wishlistCounting, setWishlistCounting] = useState(0);
  const { user } = useAuthContext();

  const loadData = useCallback(async () => {
    if (!user || !user.id) return; // Ensure user.id is available

    try {
      const docRef = doc(firestore, "Wishlists", user.id); // Assuming the collection name is "Wishlists" and user.id is valid
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const document = docSnap.data();
        setDataList(document.wishlist || []); // Fallback to empty array if wishlist is undefined
        setWishlistCounting(document.wishlist ? document.wishlist.length : 0);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }, [user]);


  useEffect(() => {
    loadData();
  }, [user, loadData]);

  const uploadFavourites = async (item) => {
    if (!item) return;

    let verifyItem = dataList.filter(x => x === item);
    if (verifyItem.length > 0) {
      window.toastify("Item already added to Wishlist", "error");
      return;
    }

    try {
      const updatedList = [...dataList, item]; // Use spread operator to create new array
      setDataList(updatedList);
      setWishlistCounting(updatedList.length);

      await setDoc(doc(firestore, "Wishlists", user.id), {
        userId: user.id,
        wishlist: updatedList,
      });
      window.toastify("Item added to Wishlist", "success");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      window.toastify("Something went wrong while adding item in Wishlist", "error");
    }
  };

  const removeFavourites = async (itemId) => {
    if (!itemId) return;

    try {
      const updatedList = dataList.filter(x => x !== itemId); // Use filter instead of splice for immutability
      setDataList(updatedList);
      setWishlistCounting(updatedList.length);

      await setDoc(doc(firestore, "Wishlists", user.id), {
        userId: user.id,
        wishlist: updatedList,
      });
      window.toastify("Item removed from Wishlist", "success");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      window.toastify("Something went wrong while removing item from Wishlist", "error");
    }
  };

  return (
    <Wishlist.Provider value={{ dataList, setDataList, wishlistCounting, setWishlistCounting, uploadFavourites, removeFavourites }}>
      {children}
    </Wishlist.Provider>
  )
}

export const useWishlistContext = () => useContext(Wishlist)
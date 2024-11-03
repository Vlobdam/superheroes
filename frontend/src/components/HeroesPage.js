import useHeroStore from "../stores/heroStore";
import { useEffect } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { HeroList } from "./HeroList.js";
import { HeroLoader } from "./HeroLoader";
import { HeroModal } from "./HeroModal.js";

export const HeroesPage = () => {
  const { heroes,
    openHeroModal,
    fetchHeroes,
    isLoading,
    error,
    clearError,
    meta,
   } = useHeroStore();
  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  useEffect(() => {
    if (error) {
      alert(error);
    }

    setTimeout(() => clearError(), 3000);
  })

  return (
    <div className="container">
      <h1>Hero Management</h1>

      <button className="btn btn-primary mb-3" onClick={() => openHeroModal()}>
        Add New Hero
      </button>
      
      {isLoading ? <HeroLoader /> : <HeroList heroes={heroes} meta={meta}/>}
      
      { error ? <ErrorMessage /> : null}
      
      <HeroModal />
    </div>
  ) 
}

import { create } from "zustand";

import { fetchHeroesApi, addHeroApi, deleteHeroApi, updateHeroApi } from "../utils/api";

const useHeroStore = create((set, get) => ({
  heroes: [],
  heroFormData: {
    id: null,
    nickname: '',
    realName: '',
    originDescription: '',
    catchPhrase: '',
    superpowers: '',
    images: [],
    deletedImages: [],
    addedImages: [],
  },
  isModalOpen: false,
  isLoading: false,
  error: null,
  meta: {
    total: 0,
    isThereNextPage: false,
    isTherePrevPage: false,
    next: null,
    prev: null,
    currentPage: 1,
    totalPages: 0
  },

  fetchHeroes: async (page = 1, limit = 5) => {
    set({ isLoading: true, error: null });
  
    try {
      const data = await fetchHeroesApi(page, limit)
      let heroes = data.heroes === null ? [] : data.heroes
      
      heroes = heroes.map(hero => ({
        id: hero.id,
        nickname: hero.nickname,
        images: hero.images,
        realName: hero.real_name,
        originDescription: hero.origin_description,
        superpowers: hero.superpowers,
        catchPhrase: hero.catch_phrase,
      }))
      console.log(heroes)
      const meta = data.meta
      set ({ heroes, meta, isLoading: false, error: null });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  openHeroModal: (hero = null) => set(() => {
    if (hero === null) {
      return {
        isModalOpen: true,
        heroFormData: { id: null, nickname: '', realName: '', originDescription: '', superpowers: '',images: [], deletedImages: [], addedImages: []},
        isEditing: true,
      }
    } 

    return {
      isModalOpen: true,
      heroFormData: {...hero, deletedImages: [], addedImages: []},
      isEditing: false
    }
  }),

  closeHeroModal: () => set({
    isModalOpen: false,
    heroFormData: { id: null, nickname: '', realName: '', originDescription: '', superpowers: '', images: [], deletedImages: [], addedImages: [] },
  }),

  setHeroFormData: (field, value) => set((state) => ({
    heroFormData: { ...state.heroFormData, [field]: value },
  })),

  toggleEditMode: () => set((state) => ({
    isEditing: !state.isEditing
  })),

  deleteHero: async () => {
    try {
      await deleteHeroApi(get().heroFormData.id);
      get().fetchHeroes();
    } catch (error) {
      set(() => ({
        error,
      }))
    }

    set(() => ({
      isModalOpen: false,
      heroFormData: { id: null, nickname: '', realName: '', originDescription: '', superpowers: '', images: [], deletedImages: [], addedImages: [] },
    }))
  },

  postHero: async (data) => {
    if (!data.nickname) {
      set(() => ({
        error: 'Nickname is required',
      }))
      return 
    }
      
    if (data.addedImages.length + data.images.length - data.deletedImages.length <= 0) {
      console.log(data.images)
      set(() => ({
        error: 'At least one image is required',
      }))
      return 
    }
    
    const isNew = !data.id;

    if (isNew) {
      const body = {
        nickname: data.nickname,
        real_name: data.realName,
        origin_description: data.originDescription,
        superpowers: data.superpowers,
        images: data.addedImages
      }
      
      try {
        await addHeroApi(body);
        
        set(() => ({
          heroFormData: { id: null, nickname: '', realName: '', originDescription: '', superpowers: '', images: [], deletedImages: [], addedImages: [] },
          isModalOpen: false
        }))

        get().fetchHeroes(get().meta.currentPage, get().meta.limit);
      } catch (error) {
        set(() => ({
          error,
        }))

      }
    }

    if (!isNew) {
      const body = {
        nickname: data.nickname ?? '',
        real_name: data.realName ?? '',
        origin_description: data.originDescription ?? '',
        superpowers: data.superpowers ?? '',
        images: data.addedImages ?? [],
        deleted_images: data.deletedImages ?? [],
      }
      
      try {
        await updateHeroApi(data.id, body);
        
        set(() => ({
          heroFormData: { id: null, nickname: '', realName: '', originDescription: '', superpowers: '', images: [], deletedImages: [], addedImages: [] },
          isModalOpen: false
        }))

        get().fetchHeroes(get().meta.currentPage, get().meta.limit);
      } catch (error) {
        set(() => ({
          error,
        }))
    return {
      isModalOpen: false,
      heroFormData: { id: null, nickname: '', realName: '', originDescription: '', superpowers: '', images: [], deletedImages: [], addedImages: [] },
    };
  }
  }
}
}))

export default useHeroStore
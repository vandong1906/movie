// types/index.ts
export interface Show {
    show_id: number;
    movie_id: number;
    theater_id: number;
    show_time: string;
  }
  
  export interface Movie {
    movie_id: number;
    movie_name: string;
  }
  
  export interface Theater {
    theater_id: number;
    theater_name: string;
  }
  
  export interface IndustryCard {
    image: string;
    title: string;
    description: string;
  }
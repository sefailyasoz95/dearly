export type Profile = {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  birth_date: string | null;
  country: string | null;
  city: string | null;
  is_paying: boolean;
  family_id: string | null;
  is_active: boolean;
};

export type Family = {
  id: string;
  created_at: string;
  family_name: string;
};

export type Album = {
  id: string;
  created_at: string;
  name: string;
  parent_album_id: string | null;
  family_id: string;
  cover_image: string | null;
  is_active: boolean;
};

export type Media = {
  id: string;
  created_at: string;
  is_image: boolean;
  url: string;
  description: string | null;
  family_id: string;
  is_active: boolean;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      families: {
        Row: Family;
        Insert: Omit<Family, 'id' | 'created_at'>;
        Update: Partial<Omit<Family, 'id' | 'created_at'>>;
      };
      albums: {
        Row: Album;
        Insert: Omit<Album, 'id' | 'created_at'>;
        Update: Partial<Omit<Album, 'id' | 'created_at'>>;
      };
      media: {
        Row: Media;
        Insert: Omit<Media, 'id' | 'created_at'>;
        Update: Partial<Omit<Media, 'id' | 'created_at'>>;
      };
    };
  };
};
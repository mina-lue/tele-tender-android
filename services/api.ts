import { Buyer } from '@/lib/domain/buyer.model';
import { Tender } from '@/lib/domain/tender.model';
import { User, UserRegistrationDto } from '@/lib/domain/user.model';
import { getAccessToken, getUser } from './auth.service';

export const TENDERS_CONFIG =  async () =>({
  API_URL: process.env.BACKEND_API_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${await getAccessToken()}`,
  },
});

export const fetchTenders = async () => {
  const config = await TENDERS_CONFIG();

  console.log(`fetching ${config.API_URL}/tenders/recent`)
  const response = await fetch(`https://tendering-app-be.onrender.com/api/tenders/recent`, { //TODO hardcoded
        method: 'GET',
        headers: config.headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tenders');
    }

    const data = await response.json();
    console.log('Fetched tenders:', data);
    return data;
}

export const fetchBuyer = async (buyerId: string) : Promise<Buyer> => {
  const config = await TENDERS_CONFIG();

  console.log(`fetching ${config.API_URL}/buyers/${buyerId}`)
  const response = await fetch(`https://tendering-app-be.onrender.com/api/users/${buyerId}`, {
    method: 'GET',
    headers: config.headers
  });

  if (!response.ok) {
    throw new Error('Failed to fetch buyer');
  }

  const data = await response.json();
  console.log('Fetched buyer:', data);
  return data;
};

export const fetchTenderDetails = async (tenderId: string) : Promise<Tender> => {
  const config = await TENDERS_CONFIG();

  console.log(`fetching ${config.API_URL}/tenders/${tenderId}`)
  const response = await fetch(`https://tendering-app-be.onrender.com/api/tenders/${tenderId}`, {
    method: 'GET',
    headers: config.headers
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tender');
  }

  const data = await response.json();
  console.log('Fetched tender:', data);
  return data;
};

export const createTender = async (tenderData: Partial<Tender>) : Promise<Tender> => {
  const config = await TENDERS_CONFIG();
  console.log('tenderData:', tenderData);

  console.log(`creating tender at ${config.API_URL}/tenders`)
  const response = await fetch(`https://tendering-app-be.onrender.com/api/tenders/new`, {
    method: 'POST',
    headers: {
      ...config.headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tenderData)
  });

  if (response.status !== 201) {
    throw new Error('Failed to create tender');
  }

  const data = await response.json();
  console.log('Created tender:', data);
  return data;
};

export const getUserData = async (): Promise<User> => {
  const config = await TENDERS_CONFIG();
  const user = await getUser();
  const userId = user ? user.id : null;

  console.log(`fetching ${config.API_URL}/users/me`)
  const response = await fetch(`https://tendering-app-be.onrender.com/api/users/${userId}`, {
    method: 'GET',
    headers: config.headers
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  const data = await response.json();
  console.log('Fetched user data:', data);
  return data;
};


export const register = async (userData: UserRegistrationDto): Promise<void> => {
  const res = await fetch(`https://tendering-app-be.onrender.com/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
  
        if (res.status !== 201) {
          const txt = await res.text();
          throw new Error(txt || "Error creating user.");
        }

      }

/*
const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const options = {method: 'GET', headers: {accept: 'application/json'}};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err)); 

  */
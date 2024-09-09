import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const KinopoiskApp = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        year: '',
        rating: '',
        genre: '',
        country: '',
        actor: ''
    });
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_TOKEN = 'HGC5RQ4-BJ1MJ3C-H33V73S-AK2VAVM';
    const BASE_URL = 'https://api.kinopoisk.dev/v1.4/movie';

    useEffect(() => {
        fetchMovies();
    }, [page, filters]);

    const fetchMovies = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}`, {
                headers: {
                    'X-API-KEY': API_TOKEN
                },
                params: {
                    page: page,
                    limit: 10,
                    ...(filters.year && { year: filters.year }),
                    ...(filters.rating && { rating: filters.rating }),
                    ...(filters.genre && { genre: filters.genre }),
                    ...(filters.country && { country: filters.country }),
                    ...(filters.actor && { actor: filters.actor })
                }
            });
            setMovies(response.data.docs);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Ошибка при загрузке фильмов:', error);
            setError('Ошибка при загрузке фильмов. Попробуйте еще раз позже.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleMovieClick = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/${id}`, {
                headers: {
                    'X-API-KEY': API_TOKEN
                }
            });
            setSelectedMovie(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных о фильме:', error);
            setError('Ошибка при загрузке информации о фильме. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="container">
            <h1>Кинопоиск</h1>

            <div className="mb-4 filters">
                <input name="year" value={filters.year} onChange={handleFilterChange} placeholder="Год" />
                <input name="rating" value={filters.rating} onChange={handleFilterChange} placeholder="Рейтинг" />
                <input name="genre" value={filters.genre} onChange={handleFilterChange} placeholder="Жанр" />
                <input name="country" value={filters.country} onChange={handleFilterChange} placeholder="Страна" />
                <input name="actor" value={filters.actor} onChange={handleFilterChange} placeholder="Актер" />
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div>
                    <ul className="list-unstyled movie-list">
                        {movies.map(movie => (
                            <li key={movie.id} className="movie-item" onClick={() => handleMovieClick(movie.id)}>
                                {movie.name}
                            </li>
                        ))}
                    </ul>

                    <div className="pagination-buttons">
                        <button onClick={handlePrevPage} disabled={page === 1 || loading}>
                            Назад
                        </button>
                        <button onClick={handleNextPage} disabled={page === totalPages || loading}>
                            Вперед
                        </button>
                    </div>

                    {selectedMovie && !loading && (
                        <div className="selected-movie">
                            <h2>{selectedMovie.name}</h2>
                            <p>{selectedMovie.alternativeName}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KinopoiskApp;
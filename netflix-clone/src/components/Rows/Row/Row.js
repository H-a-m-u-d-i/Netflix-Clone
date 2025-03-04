import React, { useEffect, useState } from 'react'
import './row.css'
import axios from '../../../utils/axios'
import movieTrailer from 'movie-trailer'
import YouTube from 'react-youtube'

const Row = ( { title, fetchUrl, isLargeRow }) => {
    const [movies, setMovies] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("")

    const base_url = "https://image.tmdb.org/t/p/original"

    useEffect(() => {
        (async () => {
            try {
                console.log(fetchUrl)
                console.log(fetchUrl)

                const request = await axios.get(fetchUrl)
                console.log(request)
                setMovies(request.data.results)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [fetchUrl]);
//************************************************************* */

// Playing the trailer from youtube
const handleClick = (movie) => {
    if (trailerUrl) {
        setTrailerUrl('');
    } else {
        movieTrailer(movie?.name || movie?.title || movie?.original_name)
            .then((url) => {
                try {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get('v'));
                } catch (e) {
                    console.error("Invalid URL", e);
                    setTrailerUrl(''); // Clear the trailer URL if it's invalid
                }
            })
            .catch((error) => {
                console.error("Error fetching trailer", error);
                setTrailerUrl(''); // Clear the trailer URL if there's an error
            });
    }
};
/************************************************************* */
// styling the youtube player
    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    }
/************************************************************* */
/************************************************************* */
return (
    <div className="row">
        <h1>{title}</h1>
        <div className="row__posters">
            {movies.map((movie, index) => (
                <img
                    onClick={() => handleClick(movie)}
                    key={index}
                    src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                    alt={movie.name}
                    className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                />
            ))}
        </div>

    {/* Playing the trailer from youtube */}
        <div style={{padding: '40px'}}>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
      
    </div>
  )
}

export default Row


import { useState, useCallback, useMemo, useReducer, useEffect } from 'react'
import useFetchPhotos from './hooks/useFetchPhotos'

/* Manage the favourite photos. */
function favouritesReducer(favourites, action) {
  // Handle the action that adds or removes a favourite.
  if (action.type === 'TOGGLE_FAVOURITE') {
    // Check whether this photo is already a favourite.
    const alreadyFavourite = favourites.includes(action.id)

    // Remove it if it is already saved as a favourite.
    if (alreadyFavourite) {
      return favourites.filter((id) => id !== action.id)
    }

    // Otherwise, add its ID to the favourites list.
    return [...favourites, action.id]
  }

  // Keep the current list for any unknown action.
  return favourites
}

// This component displays the photo gallery.
function App() {
  // Get photos and loading/error status from our custom hook.
  const { photos, loading, error } = useFetchPhotos()

  // Load saved favourite IDs from localStorage when the app starts.
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    () => JSON.parse(localStorage.getItem('favourites') || '[]')
  )

  // Save favourites whenever the list changes.
  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [favourites])

  // Store what the user types in the search box.
  const [search, setSearch] = useState('')

  // Update the search text when the user types.
  const handleSearch = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  // Filter the already-fetched photos by author name.
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase())
    )
  }, [photos, search])

  // Show a message while photos are loading.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading photos...</p>
      </div>
    )
  }

  // Show an error if the API request failed.
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {/* Page heading */}
      <h1 className="mb-6 text-center text-3xl font-bold">
        Photo Gallery
      </h1>

      {/* Search field */}
      <input
        type="text"
        placeholder="Search by author..."
        value={search}
        onChange={handleSearch}
        className="mx-auto mb-8 block w-full max-w-md rounded-lg border border-gray-300 bg-white p-3"
      />

      {/* Responsive photo grid: 1 mobile, 2 tablet, 4 desktop */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            {/* Display the photo */}
            <img
              src={photo.download_url}
              alt={`Photo by ${photo.author}`}
              className="h-56 w-full object-cover"
            />

            
{/* Show the author and the favourite button. */}
<div className="flex items-center justify-between p-4">
  <p className="font-medium">{photo.author}</p>

  {/* Toggle this photo's favourite status. */}
  <button
    type="button"
    onClick={() =>
      dispatch({
        type: 'TOGGLE_FAVOURITE',
        id: photo.id,
      })
    }
    aria-label={
      favourites.includes(photo.id)
        ? 'Remove from favourites'
        : 'Add to favourites'
    }
    className={`text-2xl ${
      favourites.includes(photo.id)
        ? 'text-red-500'
        : 'text-gray-400'
    }`}
  >
    {favourites.includes(photo.id) ? '♥' : '♡'}
  </button>
</div>

          </div>
        ))}
      </div>

      {/* Show a message when no authors match the search */}
      {filteredPhotos.length === 0 && (
        <p className="mt-8 text-center text-gray-600">
          No photos found.
        </p>
      )}
    </main>
  )
}

export default App

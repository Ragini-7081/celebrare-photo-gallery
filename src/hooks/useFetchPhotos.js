
import { useEffect, useState } from 'react'

// This custom hook fetches photos from the Picsum API.
function useFetchPhotos() {
  // Stores the list of photos returned by the API.
  const [photos, setPhotos] = useState([])

  // Tracks whether the photos are still loading.
  const [loading, setLoading] = useState(true)

  // Stores an error message if the request fails.
  const [error, setError] = useState('')

  // Runs when the component using this hook first loads.
  useEffect(() => {
    // Create an async function to fetch the photos.
    async function fetchPhotos() {
      try {
        // Request 30 photos from the Picsum API.
        const response = await fetch(
          'https://picsum.photos/v2/list?limit=30'
        )

        // Throw an error if the server responds unsuccessfully.
        if (!response.ok) {
          throw new Error('Failed to fetch photos')
        }

        // Convert the response data into JavaScript objects.
        const data = await response.json()

        // Save the fetched photos in state.
        setPhotos(data)
      } catch (err) {
        // Save an error message if fetching fails.
        setError(err.message || 'Something went wrong')
      } finally {
        // Stop loading whether the request succeeds or fails.
        setLoading(false)
      }
    }

    // Start fetching the photos.
    fetchPhotos()
  }, [])

  // Return the three values required by the assignment.
  return { photos, loading, error }
}

// Export the hook so our Gallery component can use it.
export default useFetchPhotos

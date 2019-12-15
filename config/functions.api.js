const apicalypse = require('apicalypse').default

const IGDB = apicalypse({
    baseURL: "https://api-v3.igdb.com",
    headers: {
      'Accept': 'application/json',
      'user-key': '2a79c904bd7921141480963f315e6afb'
    },
    responseType: 'json',
    timeout: 60000
  });

// ===== FUNCIONES ======
function getGameDetails(gameName, offset, limit) {
  
    // platforms.platform_logos.url
    return IGDB
      .fields(`name,cover.url,
            first_release_date,
            franchise.name,
            genres.name,
            platforms.name,
            platforms.platform_logo.url,
            screenshots.url,
            summary,
            total_rating,
            total_rating_count,
            videos.video_id`)
      .search(`${gameName}`)
      .offset(offset || 0)
      .limit(limit || 2)
      .request('/games')
      .then(res => {
  
        const result = res.data.map(data => {
  
          // Unix timestamp to normal date
          let releaseDate = new Date(data.first_release_date * 1000)
  
          // Distinto de Invalid Date y se pasa a dd-mm-yyyy
          if (!isNaN(releaseDate)) {
            releaseDate = releaseDate.getDate() + '/' + (releaseDate.getMonth() + 1) + '/' + releaseDate.getFullYear()
          } else {
            releaseDate = undefined
          }
  
          // Cover
          const cover = () => {
            if (data.cover) {
              const coverBig = data.cover.url.replace('t_thumb', 't_cover_big')
              return coverBig
            }else{
              return 'http://www.thebristolarms.com.au/wp-content/uploads/2018/03/img-not-found.png'
            }
          }
  
          // Genres
          const genres = () => {
            if (data.genres) {
              return data.genres.map(genre => genre.name)
            }
          }
  
          // Platform names
          const platformNames = () => {
            if (data.platforms) {
              return data.platforms.map(platform => platform.name)
            }
          }
  
          // Platform logo
          const platformLogo = () => {
            try {
              return data.platforms
                .map(platform => platform.platform_logo)
                .map(logo => {
                  const output = logo.url.replace('t_thumb', 't_logo_med')
                  return output
                })
            }
            catch (e){
              return undefined
            }
          }
  
          // Screenshots
          const screenshots = () => {
            if (data.screenshots) {
              return data.screenshots.map(screenshot => {
                const image = screenshot.url.replace('t_thumb', 't_screenshot_huge')
                return image
              })
            }
          }
  
          // Videos
          const videos = () => {
            if (data.videos) {
              return data.videos.map(video => video.video_id)
            }
          }
  
          const gameInfo = {
            name: data.name,
            cover: cover(),
            first_release_date: releaseDate,
            genres: genres(),
            platforms_name: platformNames(),
            platforms_logo: platformLogo(),
            screenshots: screenshots(),
            summary: data.summary,
            total_rating: data.total_rating,
            total_rating_count: data.total_rating_count,
            videos: videos()
          }
          return gameInfo
        })
  
        return result
      })
      .catch(error => console.log(error))
  }
  
  function getGenres() {
   
    // platforms.platform_logos.url
    return IGDB
      .fields(`name`)
      .request('/genres')
      .then(res => {
        return res.data.map(data => data.name)
      })
      .catch(error => console.log(error))
    }

    function getTotalDetail(gameName){

    }

    module.exports = {
        getGameDetails,
        getGenres,
        getTotalDetail
    }
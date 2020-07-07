import React, { useState, useEffect } from 'react'
import SearchSuggestion from './SearchSuggestion'
import DeploymentConfig from '../deployment/DeploymentConfig'
import axios from 'axios'

function SearchInput({ type }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  function changeHandler(event) {
    setSearchTerm(event.target.value)
  }

  useEffect(() => {
    async function searchFoods() {
      try {
        const res = await axios.get(
          DeploymentConfig().apiUrl + 'usda/search/' + searchTerm
        )
        const results = res.data.foods.filter((data) =>
          data.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setSearchResults(results)
      } catch (error) {}
    }
    searchFoods()
  }, [searchTerm])

  function resetSearch() {
    setSearchResults([])
    setSearchTerm('')
  }

  const listElements =
    searchTerm.length >= 1
      ? searchResults
          .slice(0, 5)
          .map((item) => (
            <SearchSuggestion
              key={item.fdcId}
              item={item}
              type={type}
              resetSearch={resetSearch}
            />
          ))
      : ''

  return (
    <div>
      <input
        type='text'
        className='search-bar'
        placeholder={'Search food item'}
        value={searchTerm}
        onChange={changeHandler}
      />
      <ul className='search-results'>{listElements}</ul>
    </div>
  )
}

export default SearchInput

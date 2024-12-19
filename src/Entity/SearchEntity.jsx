export const searchFunction = (event, data, setFilterData) => {
    const searchData = event.target.value.toLowerCase().trim();
    // console.log(searchData)
    if (searchData === '') {
      setFilterData(data);
    } else {
      const filtered = data.filter(
        (item) => item && item.name.toLowerCase().includes(searchData) || item && item.status.toLowerCase().includes(searchData) 
      );
      setFilterData(filtered);
    }
  };
  
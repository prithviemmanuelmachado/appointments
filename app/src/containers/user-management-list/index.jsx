import { useEffect, useState } from "react"
import ApiService from "../../services/apiservice";
import { inputTypes } from "../../constants";
import PaginationTable from "../../components/table";
import { useDispatch } from "react-redux";
import { updateToast } from "../../store/toastSlice";

export default function UserManagementList(props){
    const dispatch = useDispatch();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [isActive, setIsActive] = useState(null);
    const [isStaff, setIsStaff] = useState(null);

    const [page, setPage] = useState(0);
    const [sortList, setSortList] = useState([]);
    const [filter, setFilter] = useState(true);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0)

    const header = {
        id: {
          label: '#',
          align: 'left',
          canSort: true,
          width: '10%',
          input: {
            type: inputTypes.text,
            value: id,
            setValue: (event) =>  setId(event.target.value)
          }
        },
        first_name : {
          label: 'First name',
          align: 'left',
          canSort: true,
          width: '20%',
          input: {
            type: inputTypes.text,
            value: firstName,
            setValue: (event) =>  setFirstName(event.target.value)
          }
        },
        last_name : {
            label: 'Last name',
            align: 'left',
            canSort: true,
            width: '20%',
            input: {
              type: inputTypes.text,
              value: lastName,
              setValue: (event) =>  setLastName(event.target.value)
            }
        },
        email : {
            label: 'Email',
            align: 'left',
            canSort: true,
            width: '20%',
            input: {
              type: inputTypes.text,
              value: email,
              setValue: (event) =>  setEmail(event.target.value)
            }
        },
        is_active : {
            label: 'State',
            align: 'right',
            width: '15%',
            input: {
              type: inputTypes.select,
              value: isActive,
              setValue: (event) =>  setIsActive(event.target.value),
              options: [
                {
                  label: 'Active',
                  value: true
                },
                {
                  label: 'Inactive',
                  value: false
                }
              ]      
            }
        },
        is_staff : {
            label: 'Role',
            align: 'right',
            width: '15%',
            input: {
              type: inputTypes.select,
              value: isStaff,
              setValue: (event) =>  setIsStaff(event.target.value),
              options: [
                {
                  label: 'Doctor',
                  value: false
                },
                {
                  label: 'Administrator',
                  value: true
                }
              ]      
            }
        },
    }
    
    const onSortAsc = (key) => {
        setSortList((prevSortList) => {
          let updatedList = [...prevSortList];
    
          // Check if the key exists in the array
          if (updatedList.includes(key)) {
            // Remove the key
            updatedList = updatedList.filter(item => item !== key);
          } else if (updatedList.includes(`-${key}`)) {
            // If `-key` exists, remove it and add `key`
            updatedList = updatedList.filter(item => item !== `-${key}`);
            updatedList.push(key);
          } else {
            // If key does not exist, add it
            updatedList.push(key);
          }
    
          return updatedList;
        });
    }
    
    const onSortDesc = (key) => {
        setSortList((prevSortList) => {
          let updatedList = [...prevSortList];
    
          // Check if the -key exists in the array
          if (updatedList.includes(`-${key}`)) {
            // Remove the key
            updatedList = updatedList.filter(item => item !== `-${key}`);
          } else if (updatedList.includes(key)) {
            // If `key` exists, remove it and add `-key`
            updatedList = updatedList.filter(item => item !== key);
            updatedList.push(`-${key}`);
          } else {
            // If key does not exist, add it
            updatedList.push(`-${key}`);
          }
    
          return updatedList;
        });
    }
    
    const resetFilters = () => {
        setFirstName('');
        setLastName('');
        setId('');
        setEmail('');
        setIsActive(null);
        setIsStaff(null);
        setPage(0);
        setTotalCount(0);
        setSortList([]);
    }

    const onClick = (data) => {
        console.log(data);
    }
    
    useEffect(() => {
        ApiService.get(
            'users/',
            {
                first_name: firstName,
                last_name: lastName,
                id: id,
                email: email,
                is_active: isActive,
                is_staff: isStaff,
                ordering: sortList.join(','),
                page: page + 1
            }
        )
        .then((res) => {
            setTotalCount(res.data.count);
            setData(res.data.results.map((data) => {
                return {
                    ...data,
                    is_active: data.is_active ? 'Active' : 'Inactive',
                    is_staff: data.is_staff ? 'Administrator' : 'Doctor'
                }
            }));
        })
        .catch((err) => {
            dispatch(updateToast({
                bodyMessage : err.response.data,
                isVisible : true,
                type: 'error'
            }))
        })
    },[sortList, page, filter])
    
    
    return <PaginationTable
        headers = {header}
        data = {data}
        pageNumber = {page}
        setPageNumber = {setPage}
        onFilter = {() => setFilter(!filter)}
        onReset = {resetFilters}
        onSortAsc = {onSortAsc}
        onSortDesc = {onSortDesc}
        sortList = {sortList}
        totalCount={totalCount}
        onRowClick={onClick}/>
}
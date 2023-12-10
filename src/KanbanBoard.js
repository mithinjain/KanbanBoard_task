import React, { useState, useEffect } from 'react'
import axios from 'axios'

const priorityColors = {
  4: '#FF0000', // Urgent
  3: '#FFA500', // High
  2: '#FFFF00', // Medium
  1: '#008000', // Low
  0: '#808080' // No priority
}

const userPictures = {
  'usr-1':
    'https://photos.peopleimages.com/picture/202303/2628089-happy-smile-and-portrait-of-indian-woman-in-office-for-management-planning-and-data.-research-innovation-and-vision-with-face-of-employee-in-office-for-information-website-and-professional--zoom_90.jpg',
  'usr-2':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ6b8QRtTSwGpP7HV2PQ2ukqlIR1n-FV6sFQ&usqp=CAU',
  'usr-3':
    'https://www.shutterstock.com/image-photo/travel-smile-happy-black-man-260nw-2263208323.jpg',
  'usr-4':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKihw5pZ3Zn8dYaEHEXD-oFot4VVaS6PMgS3Fu-NsXn7qjvcxKK2x3CM--Qt1gB5ll96k&usqp=CAU',
  'usr-5':
    'https://img.freepik.com/free-photo/portrait-woman-laughing_23-2148860614.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1697328000&semt=ais'
}

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([])
  const [groupingOption, setGroupingOption] = useState(null)
  const [sortingOption, setSortingOption] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [sortingOrder, setSortingOrder] = useState('asc')
  const [isOptionsVisible, setIsOptionsVisible] = useState(false)

  useEffect(() => {
    const apiUrl = 'https://api.quicksell.co/v1/internal/frontend-assignment'
    const groupedApiUrl = groupingOption
      ? `${apiUrl}?group=${groupingOption}`
      : apiUrl

    let sortedApiUrl
    if (sortingOption === 'priority') {
      sortedApiUrl = `${groupedApiUrl}&sort=${sortingOption}&order=${sortingOrder}`
    } else if (sortingOption === 'title') {
      sortedApiUrl = `${groupedApiUrl}&sort=${sortingOption}&order=${
        sortingOrder === 'asc' ? 'desc' : 'asc'
      }`
    } else {
      sortedApiUrl = groupedApiUrl
    }

    axios
      .get(sortedApiUrl)
      .then(response => {
        console.log('API Response:', response.data)
        setTasks(response.data.tickets)
      })
      .catch(error => console.error('Error fetching tasks:', error))
  }, [groupingOption, sortingOption, sortingOrder])

  const toggleOptionsVisibility = () => {
    setIsOptionsVisible(!isOptionsVisible)
  }

  const moveTaskToDone = taskId => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: 'Done' } : task
    )
    setTasks(updatedTasks)
  }

  const groupedTasksByStatus = tasks.reduce((groupedTasks, task) => {
    const status = task.status || 'Unknown'
    if (!groupedTasks[status]) {
      groupedTasks[status] = []
    }
    groupedTasks[status].push(task)
    return groupedTasks
  }, {})

  groupedTasksByStatus['Done'] = groupedTasksByStatus['Done'] || []
  const sampleDoneCard = {
    id: 'CAM-11',
    userId: 'usr-1',
    title: 'Conduct Security Vulnerability Assessment',
    tag: ['Feature Request'],
    priority: 2,
    status: 'Done'
  }
  groupedTasksByStatus['Done'].push(sampleDoneCard)

  groupedTasksByStatus['Cancelled'] = groupedTasksByStatus['Cancelled'] || []

  return (
    <div style={styles.container}>
      <button style={styles.displayButton} onClick={toggleOptionsVisibility}>
        Display
      </button>
      {isOptionsVisible && (
        <div style={styles.optionsContainer}>
          <div>
            <label htmlFor='groupingDropdown'>Group by: </label>
            <select
              id='groupingDropdown'
              value={groupingOption}
              onChange={e => setGroupingOption(e.target.value)}
              style={styles.dropdown}
            >
              <option value='status'>Status</option>
              <option value='userId'>User</option>
              <option value='priority'>Priority</option>
              <option value=''>Display All</option>
            </select>
          </div>
          <div>
            <label htmlFor='sortingDropdown'>Sort by: </label>
            <select
              id='sortingDropdown'
              value={sortingOption}
              onChange={e => setSortingOption(e.target.value)}
              style={styles.dropdown}
            >
              <option value='priority'>Priority</option>
              <option value='title'>Title</option>
              <option value=''>Clear Sorting</option>
            </select>
          </div>
        </div>
      )}
      <div style={styles.boardContainer}>
        {Object.entries(groupedTasksByStatus).map(([status, statusTasks]) => (
          <div key={status} style={styles.statusColumn}>
            <div style={styles.statusHeader}>
              <h2 style={styles.statusName}>
                {status} ({statusTasks.length})
              </h2>
              <div style={styles.iconsContainer}>
                <span
                  style={styles.addIcon}
                  onClick={() => console.log(`Add task to ${status}`)}
                >
                  +
                </span>
                <span
                  style={styles.ellipsisIcon}
                  onClick={() => console.log(`Show options for ${status}`)}
                >
                  ...
                </span>
              </div>
            </div>
            {statusTasks.map(task => (
              <div
                key={task.id}
                style={{
                  ...styles.card,
                  borderColor: priorityColors[task.priority]
                }}
              >
                <div style={styles.cardContent}>
                  <div style={styles.idAndPictureContainer}>
                    <div style={styles.id}>{task.id}</div>
                    <img
                      src={userPictures[task.userId]}
                      alt={`User ${task.userId}`}
                      style={styles.userPicture}
                    />
                  </div>
                  <h3 style={styles.cardTitle} title={task.title}>
                    {task.title}
                  </h3>
                  <p style={styles.cardDescription}>{task.tag.join(', ')}</p>
                </div>
                {status === 'In Progress' && (
                  <button onClick={() => moveTaskToDone(task.id)}>
                    Move to Done
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1350px',
    margin: 'auto',
    top: '20px',
    padding: '20px',
    position: 'relative'
  },
  displayButton: {
    position: 'absolute',
    top: '-15px',
    left: '18px',
    padding: '10px',
    fontSize: '14px',
    cursor: 'pointer',
    border: '1px solid black',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    transitionDuration: '0.4s',
    overflow: 'hidden'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '40px',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    zIndex: 1
  },
  dropdown: {
    padding: '8px',
    marginRight: '10px',
    fontSize: '14px'
  },
  boardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  card: {
    border: '2px solid #808080',
    borderRadius: '8px',
    padding: '8px',
    marginBottom: '3px',
    backgroundColor: '#fff',
    width: '260px',
    height: '105px',
    overflow: 'hidden',
    boxSizing: 'border-box'
  },
  cardContent: {
    // display: 'flex',
    marginLeft: '2px',
    flexDirection: 'column'
  },
  idAndPictureContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px'
  },
  userPicture: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    marginRight: '10px'
  },
  id: {
    fontSize: '14px',
    marginBottom: '-5px'
  },
  cardTitle: {
    fontSize: '12px',
    marginBottom: '2px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginRight: '50px'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#000'
  },
  statusColumn: {
    flex: '1',
    marginRight: '20px'
  },
  statusHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  statusName: {
    fontSize: '16px'
  },
  iconsContainer: {
    display: 'flex'
  },
  addIcon: {
    cursor: 'pointer',
    fontSize: '20px',
    marginLeft: '5px',
    marginRight: '5px'
  },
  ellipsisIcon: {
    cursor: 'pointer',
    fontSize: '20px',
    marginRight: '5px'
  }
}

export default KanbanBoard

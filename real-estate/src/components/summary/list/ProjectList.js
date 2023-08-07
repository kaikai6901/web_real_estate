
import { useState, useEffect } from "react";
import ProjectCard from "../elements/ProjectCard";
function ProjectList (props) {
    const [projects, setProjects] = useState([])
    
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/summary/get_list_project`)
        .then(res => res.json())
        .then(projects => {
            setProjects(projects)
        })
    }, [])

    return (
        <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap', display: 'flex', marginLeft: '24px', marginRight: '24px' }}>
           {
            projects.map((project) => (
                <ProjectCard project={project} open={props.open} setOpen={props.setOpen}/>
            ))
           }
        </div>
    )

}
export default ProjectList;
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import Form from "../../../components/Form"
import Input from "../../../components/Input"
import Label from "../../../components/Label"


const NewEntityForm = () => {

    const [geo, setGeo] = useState({})



    useEffect(() => {
        const fetchGeo = async () => {
            
        }

        fetchGeo()
    }, [])

    const formik = useFormik({
        initialValues:{
            name: '',
            description: '',

        }
    })

    const handleSubmit = () => {

    }

  return (
    <Form handleSubmit={handleSubmit}>
        <section>
            <Label htmlFor="name">Nume</Label>
            <Input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="Numele entitatii" 
                handleChange={formik.handleChange} 
                handleBlur={formik.handleBlur} 
                value={formik.values.name}/>
        </section>

        <section>
            <Label htmlFor="description">Descriere</Label>
            <textarea 
                className="resize-none text-gray-900"
                spellCheck='false'
                id="description" 
                name="description" 
                placeholder="Descriere" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.description}
            />
        </section>

        <section>
            <Label htmlFor="country">Tara</Label>
            <select name="country" id="country">
                <option value="">Selectati o tara</option>

            </select>
        </section>

        <section>
            <Label htmlFor="county">Judet</Label>
            <select name="county" id="county">
                <option value="">Selectati un judet</option>

            </select>
        </section>

        <section>
            <Label htmlFor="city">Tara</Label>
            <select name="city" id="city">
                <option value="">Selectati un oras</option>

            </select>
        </section>
        
    </Form>
  )
}

export default NewEntityForm
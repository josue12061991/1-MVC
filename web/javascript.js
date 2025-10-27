
fetch("http://localhost:3000/peleadores")
    .then(res=>res.json())
    .then(Participantes=>{
        let lista=Participantes.map(item=>
                `<div data-id="${item.id}">
                    <h1>${item.id}</h1>
                    <h2>${item.name}</h1>
                    <img src="${item.image}"></img>
                    <button>Delete</button>
                </div>`
            ).join('')
            document.querySelector(".cuerpo").innerHTML=lista 

            document.addEventListener('click',e=>{
                if(e.target.matches('button')){
                    const div=e.target.closest('div')
                    const id=div.dataset.id

                    fetch(`http://localhost:3000/peleadores/${id}`,{method:'DELETE'})
                        .then(res=>{
                            //esta respuesta espera un status 200-209
                            if(res.ok){
                                div.remove()
                            }
                        })
                }
            })

        })
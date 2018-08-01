new Vue({
    el: '#cadastro_disc',
    data: {
        disciplina: "",
        codigo_disciplina: "",
        creditos: 0,
        horas: 0,
        grade: "",
        semestre: ""

    },
    methods:{
        atualizacarga: function(){
            creditos = document.getElementById('creditos').value;
            horas = creditos*15;
            document.getElementById('horas').value = horas;
        },
        validaCadastro: function(){
            if(this.disciplina == "" || this.codigo_disciplina == "" || this.grade == "" || this.semestre == ""){
                alert("Cadastro inválido");
            }
            else{
                atualizar = this.existe_disc(this.codigo_disciplina);
                console.log(this.codigo_disciplina);
                if(atualizar){
                    yesno = confirm("Código ja existe, deseja atualizar a disciplina?");
                    if(yesno){
                        altera_disciplina(this.semestre, this.disciplina, this.codigo_disciplina, this.creditos, this.hora, this.grade);
                        alert('Disciplina cadastrada');
                    }        
                    else{
                        alert('Disciplina não cadastrada');
                    }
                }    
                else{
                    if(this.grade == "Ambas"){
                        cadastra_disciplina(this.semestre, this.disciplina, this.codigo_disciplina, this.creditos, this.horas, "Nova");
                        cadastra_disciplina(this.semestre, this.disciplina, this.codigo_disciplina, this.creditos, this.horas, "Antiga");

                    }
                    else{
                        cadastra_disciplina(this.semestre, this.disciplina, this.codigo_disciplina, this.creditos, this.horas, this.grade);
                    }
                    alert('Disciplina cadastrada');
                    
                }
            }
        },
        existe_disc: function(codigo){
                disciplina = disciplinas.get_disciplina(codigo);
                if(disciplina.length == 0){
                    return false;
                }
                else{
                    return true;
                }
        }
    }
})

disciplinas = new Vue({
    el: '#disciplinas',
    data:{
        selecionadas: [],
        disciplinas: get_disciplinas() //Precisa pegar do banco de dados
    },
    methods: {
        getDisc: function(){
            //getAllDisciplinas
            return this.disciplinas;
        },
        validaCreditos: function(){
            creditos = this.selecionadas.map(e => e.creditos).reduce((e,a) => e+a);
            dependencia = false;
            if(creditos < 16){
                alert("Créditos insuficientes, coloque mais disciplinas");
            }
            else if(creditos > 24){
                alert("Créditos excedentes, coloque menos disciplinas");
            }
            else if(dependencia){
                alert("Combinação inválida");
            }
            else{
//                cadastraPreMatricula();
                alert("Pré-matricula executada com sucesso");
            }
        },
        deletaDisciplina: function(codigo){
            disciplina = this.get_disciplina(codigo)[0];
            this.apaga_disciplina('http://localhost:8088/disciplinas/', disciplina);
        },
        get_disciplina: function(codigo){
            element = this.disciplinas.filter(e => e.codigo_disciplina == codigo);
            if(element.length == 0){
                return [];
            }
            return element;
        },
        apaga_disciplina: function(url, disciplina){
            fetch(url,{
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "DELETE", 
                body: JSON.stringify(disciplina)
            })
        .then(response => response.json());
        }, 
    }
})

function cadastra_disciplina(periodo, nome, codigo, credito, carga, grade){
    disciplina = {};
    disciplina.semestre = periodo;
    disciplina.disciplina = nome;
    disciplina.codigo_disciplina = codigo;
    disciplina.creditos = credito;
    disciplina.horas = carga;
    disciplina.grade = grade;
    postaDisciplina(disciplina);
}

function altera_disciplina(periodo, nome, codigo, credito, carga, grade){
    disciplina = {};
    disciplina.semestre = periodo;
    disciplina.disciplina = nome;
    disciplina.codigo_disciplina = codigo;
    disciplina.creditos = credito;
    disciplina.horas = carga;
    disciplina.grade = grade;
    putDisciplina(disciplina);
}

function putDisciplina(disciplina){
    fetch('http://localhost:8088/disciplinas/', {
        headers: {
              'Content-Type': 'application/json'
        },
        method: "PUT", body: JSON.stringify(disciplina)})
        .then(response => response.json());
}


function postaDisciplina(disciplina){
    fetch('http://localhost:8088/disciplinas/', {
        headers: {
              'Content-Type': 'application/json'
        },
        method: "POST", body: JSON.stringify(disciplina)})
        .then(response => response.json());
}

function cadastra(discs, grade){
    semOptativas = discs.filter(e => e.disciplina.substring(0,8) != "Optativa");
    semOptativas.map(e => cadastra_disciplina(e.semestre, e.disciplina, e.codigo_disciplina, e.creditos, e.horas, grade));
}

function get_disciplinas(){
    fetch('http://localhost:8088/disciplinas/')
    .then(response => response.json())
     .then(function(promise){
        disciplinas.disciplinas = promise;
     })
}

//fetch('http://analytics.ufcg.edu.br/pre/ciencia_da_computacao_i_cg/disciplinas').then(response => response.json()).then(promise => cadastra(promise, "Nova"));
//fetch('http://analytics.ufcg.edu.br/pre/ciencia_da_computacao_d_cg/disciplinas').then(response => response.json()).then(promise => cadastra(promise, "Antiga"));

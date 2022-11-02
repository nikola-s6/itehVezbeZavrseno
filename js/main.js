$("#dodajForm").submit(function () {
    //ako stavimo funkciju bez parametara on ce precrtati event ali ce raditi jer ima globalni event
    event.preventDefault();//ovo znaci nemoj da refreshujes stranicu
    const form = $(this);//this je njegov prvi roditelj odnosno nad kojim elementom smo pozvali funkciju
    const serialized = form.serialize();

    //console.log(serializeArray)
    //name je ime polja a value je sta smo uneli
    //reduce ovo prazno je prazan objekat
    //radimo jer hocemo da pretvorimo u key value parove
    const obj = form.serializeArray().reduce(function (json, { name, value }) {
        json[name] = value;
        return json;
    }, {}
    );

    // console.log(obj);
    console.log(serialized);

    request = $.ajax({
        url: "handler/add.php",
        type: "post",
        data: serialized
    });

    request.done(function (response, textStatus, jqXHR) {
        if (response === "Success") {
            alert("Tim je dodat")
            // location.reload()
            appendRow(obj)

        } else {
            console.log("Tim nije dodat")
        }
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Desila se greska: " + textStatus, errorThrown)
    })

})


function appendRow(obj) {
    //drugi nacin pisanja ajaxa
    $.get("handler/getLastElement.php", function (data) {
        $("#tabela tbody").append(`
        <tr id="tr-${data}">
            <td>${data}</td>
            <td>${obj.nazivTima}</td>
            <td>${obj.drzava}</td>
            <td>${obj.godinaOsnivanja}</td>
            <td>${obj.brojTitula}</td>
            <td>
                <label class="radio-btn">
                    <input type="radio" name="checked-donut" value=${data}>
                    <span class="checkmark"></span>
                </label>
            </td>
        </tr>
    `);
    })
}



/////////////////////////////////////////////DELETE///////////////////////////////

function izbrisi() {
    var id = getRadioValue()
    if (id == 0) return


    event.preventDefault()

    request = $.ajax({
        url: "handler/delete.php",
        type: "post",
        data: "timID=" + id
    });

    request.done(function (response, textStatus, jqXHR) {
        if (response === "Success") {
            alert("Tim je obrisan")
            // location.reload()
            $(`#tr-${id}`).remove()

        } else {
            console.log("Tim nije obrisan")
        }
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Desila se greska: " + textStatus, errorThrown)
    })

}


function getRadioValue() {
    var buttons = $('#tabela .radio-btn input')

    for (i = 0; i < buttons.length; i++) {
        if (buttons[i].checked) {
            return buttons[i].value
        }
    }
    return 0

}


///////////////////////////////UPDATE/////////////////////////////////////
function izmeniPostaviPodatke() {
    var id = getRadioValue()
    if (id == 0) {
        alert("Nije naznacen tim za izmenu")
        return
    }
    console.log(id)

    $("#izmeniForm #idd").val(id)

    event.preventDefault()


    request = $.ajax({
        url: "handler/get.php",
        type: "post",
        data: "timID=" + id
    });

    request.done(function (response, textStatus, jqXHR) {
        if (!(response === "Failed")) {

            // console.log(response)
            response = response.slice(1, -1)
            // console.log(response);
            var obj = JSON.parse(response)

            console.log(obj['nazivTima']);
            $('#izmeniForm #nazivv').val(obj['nazivTima'])

            console.log(obj['drzava']);
            $('#izmeniForm #drzavaa').val('nestojfdsuidbf')

            console.log(obj['godinaOsnivanja'] * 1);
            $('#izmeniForm #godinaa').val(obj['godinaOsnivanja'])

            console.log(obj['brojTitula'] * 1);
            $('#izmeniForm #brojj').val(obj['brojTitula'])

        } else {
            console.log("Tim nije obrisan")
        }
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Desila se greska: " + textStatus, errorThrown)
    })


}

$("#izmeniForm").submit(function () {


    event.preventDefault();
    const form = $(this);
    const serialized = form.serialize();


    const obj = form.serializeArray().reduce(function (json, { name, value }) {
        json[name] = value;
        return json;
    }, {}
    );

    // console.log(obj);
    console.log(serialized);

    request = $.ajax({
        url: "handler/update.php",
        type: "post",
        data: serialized
    });

    request.done(function (response, textStatus, jqXHR) {
        if (response === "Success") {
            $(`#tabela tbody #tr-${obj["timID"]}`).find("td").eq(1).html(obj['nazivTima'])
            $(`#tabela tbody #tr-${obj["timID"]}`).find("td").eq(2).html(obj['drzava'])
            $(`#tabela tbody #tr-${obj["timID"]}`).find("td").eq(3).html(obj['godinaOsnivanja'])
            $(`#tabela tbody #tr-${obj["timID"]}`).find("td").eq(4).html(obj['brojTitula'])
            alert("Tim je izmenjen")
        } else {
            console.log("Tim nije izmenjen")
        }
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Desila se greska: " + textStatus, errorThrown)
    })

})


//////////////////////////////PRETRAGA////////////////////////////////////


function pretrazi() {

    let val = $("#myInput")[0].value;
    let row = $(`#tr-${val} td`)

    request = $.ajax({
        url: "handler/get.php",
        type: "post",
        data: "timID=" + val
    })

    request.done(function (response, textStatus, jqXHR) {

        if (!(response === "Failed")) {
            // console.log("prosao u success");
            replaceTableData(row)
        }

    })

    request.fail(function (jqXHR, textStatus, erorThrown) {
        alert("Desila se greska: " + textStatus, console.erorThrown)
    })


}

function replaceTableData(row) {
    $('#tabela #tableBody').empty()

    $("#tabela tbody").append(`
        <tr id="tr-${row[0].outerText}">
            <td>${row[0].outerText}</td>
            <td>${row[1].outerText}</td>
            <td>${row[2].outerText}</td>
            <td>${row[3].outerText}</td>
            <td>${row[4].outerText}</td>
            <td>
                <label class="radio-btn">
                    <input type="radio" name="checked-donut" value=${row[0].outerText}>
                    <span class="checkmark"></span>
                </label>
            </td>
        </tr>
    `);
}



////////////////////////////////////PRIKAZI///////////////////////////////////////////

function prikazi() {
    $('#tabela #tableBody').empty()
    $('#myInput').val("")


    $.get("handler/getAll.php", function (data) {
        let array = data.split("}")
        array.pop()
        array.forEach(element => {
            element = element + "}"
            // console.log(element);
            let obj = JSON.parse(element)

            $("#tabela tbody").append(`
            <tr id="tr-${obj.timID}">
                <td>${obj.timID}</td>
                <td>${obj.nazivTima}</td>
                <td>${obj.drzava}</td>
                <td>${obj.godinaOsnivanja}</td>
                <td>${obj.brojTitula}</td>
                <td>
                    <label class="radio-btn">
                        <input type="radio" name="checked-donut" value=${data}>
                        <span class="checkmark"></span>
                    </label>
                </td>
            </tr>
        `)

        });
    })
}

//////////////////////////SORTIRAJ//////////////////////////////


function sortTable() {

    $('#tabela #tableBody').empty()
    $('#myInput').val("")

    $.get("handler/getSorted.php", function (data) {
        let array = data.split("}")
        array.pop()
        array.forEach(element => {
            element = element + "}"
            // console.log(element);
            let obj = JSON.parse(element)

            $("#tabela tbody").append(`
            <tr id="tr-${obj.timID}">
                <td>${obj.timID}</td>
                <td>${obj.nazivTima}</td>
                <td>${obj.drzava}</td>
                <td>${obj.godinaOsnivanja}</td>
                <td>${obj.brojTitula}</td>
                <td>
                    <label class="radio-btn">
                        <input type="radio" name="checked-donut" value=${data}>
                        <span class="checkmark"></span>
                    </label>
                </td>
            </tr>
        `)

        });
    })

}
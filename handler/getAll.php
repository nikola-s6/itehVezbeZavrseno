<?php

require "../dbBroker.php";
require "../model/tim.php";

$result = Tim::getAll($conn);


if ($result) {
    while ($red = $result->fetch_array()) {
        echo json_encode($red);
    }
} else {
    echo "Failed";
}

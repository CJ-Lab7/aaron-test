#!/bin/bash
#
# Open cypress and seed database with common content
# 
# ----------------------------------------------------------

set -e

# helpers
# -------
usage() {

	echo "
Usage: open_cypress.sh [options]

Arguments:
  -h     Show help message and exit.
  -H     Host for ESP instance (default: 127.0.0.1).
  -P     Port for ESP instance (default: 8080).
  -u     Email for connecting to ESP (default: admin@localhost)
  -X     Password for connecting to ESP  (default: admin).
  -r     run in headless mode
  -d     record results in Cypress.io dashboard
  -e     turn off seeding database with indexseed.yml
  -t     Specific subset of specs to run (default is 'apps/quickstart/*').
"
	exit 1
}

# args
# ----
PASSWORD=admin
HOST=127.0.0.1
PORT=8080
EMAIL=admin@localhost
MODE=open
RECORD=false
SEED=true
SPECS='quickstart/*'
while getopts ":u:X:H:P:t:ehrdn" opt; do
  case ${opt} in
    # help/usage
    h )
      usage
      ;;
    # url
    H )
      HOST=$OPTARG;
      ;;
    # url
    P )
      PORT=$OPTARG;
      ;;
    # email
    u )
      EMAIL=$OPTARG
      ;;
    # seed database with users/workflows/etc
    e )
      SEED=false
      ;;
    # password
    X )
      PASSWORD=$OPTARG
      ;;	  
    # headless
    r )
      MODE=run
      ;;	
    # headless
    d )
      RECORD=true
      ;;
    # tests
    t )
      SPECS=$OPTARG
      ;;	
    \? )
      echo "Invalid option: $OPTARG" 1>&2;
      exit 1
      ;;
    : )
      echo "Invalid option: $OPTARG requires an argument" 1>&2;
      exit 1
      ;;
  esac
done
shift $((OPTIND -1))

[ ! `which esp | wc -l` -eq 1 ] && echo 'Missing dependency! Please install the ESP Client. Clone espclient & run `python setup.py develop`. Abort!' && exit 1
[ ! `which npx | wc -l` -eq 1 ] && echo 'Missing dependency! Please install npx and configure. `brew install npx`. Abort!' && exit 1


# build baseUrl
PROTOCOL=http
BASE_URL="${PROTOCOL}://${HOST}:${PORT}"
if [ $PORT -eq "443" ]; then
	PROTOCOL=https
  BASE_URL="${PROTOCOL}://${HOST}"
fi

# flags
FLAGS=""
if [ $MODE == "run" ]; then
  FLAGS+="--headless --browser chrome --spec \'cypress/integration/$SPECS*\' "
fi
if $RECORD; then
  FLAGS+="--record --key 6ab67c3d-fa34-46be-9620-79fc73783139 "
fi

# seed
# esp -P $PORT -H $HOST -u $EMAIL -p $PASSWORD clear
# if $SEED; then
#   esp -P $PORT -H $HOST -u $EMAIL -p $PASSWORD seed --no-overwrite cypress/fixtures/apps/common/indexseed.yml 
# fi

# open cypress
echo $PWD
COMMAND="npx cypress@5.2.0 $MODE --env passwordAdmin=$PASSWORD,PROTOCOL=$PROTOCOL,HOST=$HOST,PORT=$PORT --config baseUrl=\"${BASE_URL}\" ${FLAGS}"
echo $COMMAND
eval $COMMAND

echo git tag: $TRAVIS_TAG

if [ $TRAVIS_TAG ] && [ "$TRAVIS_TAG"x != ""x ]; then

    if [ `echo $TRAVIS_TAG | grep "^plugin_[0-9]\+\.[0-9]\+\.[0-9]\+$"` ]; then

        echo ''
        echo '[is a tag] start packing'
        npm install
        npm run build

    else

        echo ''
        echo 'The format of the tag is not correct'

    fi

else

echo ''
echo '[not a tag] exit packing.'

fi
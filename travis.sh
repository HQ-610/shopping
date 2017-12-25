
echo git tag: $TRAVIS_TAG
if [ $TRAVIS_TAG ] && [ "$TRAVIS_TAG"x != ""x ]; then

echo ''
echo '[is a tag] start packing'

npm install es-lint
npm run lint

else

echo ''
echo '[not a tag] exit packing.'

fi